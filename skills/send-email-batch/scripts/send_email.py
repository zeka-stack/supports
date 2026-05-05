#!/usr/bin/env python3
"""
Batch email sender driven by a JSON spec file.

Usage:
    python send_email.py <spec.json>           # dry-run (default, safe)
    python send_email.py <spec.json> --send    # actually send

Spec JSON schema (all keys are optional unless marked required):

{
    "recipients": ["a@x.com", "b@y.com"],              // REQUIRED, list of addresses

    // Content: either single-language OR bilingual (cn/en)
    "subject":    "Single subject",                     // single-language mode
    "body":       "Plain text body",
    // -- OR --
    "subject_cn": "中文主题",                             // bilingual mode
    "body_cn":    "中文正文",
    "subject_en": "English subject",
    "body_en":    "English body",

    // Override language routing (bilingual mode only).
    // Default: qq.com/163.com/126.com/sina.com/foxmail.com/139.com/aliyun.com -> cn
    "cn_domains": ["qq.com", "163.com"],

    // Sender info (env vars win if set).
    "from_name":  "dong4j",
    "reply_to":   "you@gmail.com",

    // Delivery tuning
    "interval_seconds": 1.5                             // sleep between sends
}

Required environment variables (only checked when --send is passed):
    SMTP_USER                                 sender email
    <provider>_SMTP_PASS (or SMTP_PASS)       provider-specific password

Password lookup order (first match wins, based on SMTP_USER domain):
    @gmail.com                       -> GMAIL_SMTP_PASS    else SMTP_PASS
    @qq.com                          -> QQ_SMTP_PASS       else SMTP_PASS
    @163.com / @126.com              -> NETEASE_SMTP_PASS  else SMTP_PASS
    @outlook.com / hotmail / live    -> OUTLOOK_SMTP_PASS  else SMTP_PASS
    others                           -> SMTP_PASS

Optional environment variables (auto-detected from SMTP_USER domain):
    SMTP_HOST, SMTP_PORT, SMTP_MODE, SMTP_FROM_NAME, SMTP_FROM_EMAIL, REPLY_TO

Auto-detected SMTP for common providers based on SMTP_USER domain:
    gmail.com       -> smtp.gmail.com:465  (SSL)
    qq.com          -> smtp.qq.com:465     (SSL)
    163.com         -> smtp.163.com:465    (SSL)
    126.com         -> smtp.126.com:465    (SSL)
    outlook.com     -> smtp-mail.outlook.com:587 (STARTTLS)
    hotmail.com     -> smtp-mail.outlook.com:587 (STARTTLS)
    Others          -> must set SMTP_HOST and SMTP_PORT explicitly
"""

from __future__ import annotations

import json
import os
import smtplib
import ssl
import sys
import time
from email.message import EmailMessage
from email.utils import formataddr, make_msgid
from pathlib import Path

DEFAULT_CN_DOMAINS = {
    "qq.com", "163.com", "126.com", "sina.com", "sina.cn",
    "foxmail.com", "139.com", "189.cn", "aliyun.com", "outlook.cn",
}

SMTP_PROFILES = {
    "gmail.com":   ("smtp.gmail.com",         465, "ssl"),
    "qq.com":      ("smtp.qq.com",            465, "ssl"),
    "163.com":     ("smtp.163.com",           465, "ssl"),
    "126.com":     ("smtp.126.com",           465, "ssl"),
    "outlook.com": ("smtp-mail.outlook.com",  587, "starttls"),
    "hotmail.com": ("smtp-mail.outlook.com",  587, "starttls"),
    "live.com":    ("smtp-mail.outlook.com",  587, "starttls"),
}

# 按发件邮箱域名映射到专用密码环境变量名,找不到时回落到 SMTP_PASS
PASSWORD_ENV_MAP = {
    "gmail.com":   "GMAIL_SMTP_PASS",
    "qq.com":      "QQ_SMTP_PASS",
    "163.com":     "NETEASE_SMTP_PASS",
    "126.com":     "NETEASE_SMTP_PASS",
    "outlook.com": "OUTLOOK_SMTP_PASS",
    "hotmail.com": "OUTLOOK_SMTP_PASS",
    "live.com":    "OUTLOOK_SMTP_PASS",
}


def resolve_password(user: str) -> tuple[str, str]:
    """返回 (密码, 使用的环境变量名)。找不到时密码为空字符串。"""
    domain = user.split("@", 1)[1].lower() if "@" in user else ""
    specific = PASSWORD_ENV_MAP.get(domain)
    if specific and os.environ.get(specific):
        return os.environ[specific], specific
    if os.environ.get("SMTP_PASS"):
        return os.environ["SMTP_PASS"], "SMTP_PASS"
    return "", specific or "SMTP_PASS"


def fail(msg: str, code: int = 2) -> None:
    print(f"[错误] {msg}", file=sys.stderr)
    sys.exit(code)


def load_spec(path: str) -> dict:
    p = Path(path)
    if not p.is_file():
        fail(f"spec 文件不存在: {path}")
    try:
        spec = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        fail(f"spec JSON 解析失败: {e}")
    if not isinstance(spec, dict):
        fail("spec 根必须是 JSON 对象")
    if not spec.get("recipients"):
        fail("spec.recipients 不能为空")
    bilingual = any(k in spec for k in ("subject_cn", "subject_en", "body_cn", "body_en"))
    if bilingual:
        for k in ("subject_cn", "body_cn", "subject_en", "body_en"):
            if not spec.get(k):
                fail(f"双语模式缺少字段: {k}")
    else:
        for k in ("subject", "body"):
            if not spec.get(k):
                fail(f"单语模式缺少字段: {k}")
    return spec


def pick_lang(addr: str, cn_domains: set[str]) -> str:
    domain = addr.split("@", 1)[1].lower().strip()
    return "cn" if domain in cn_domains else "en"


def resolve_smtp(user: str) -> tuple[str, int, str]:
    host = os.environ.get("SMTP_HOST")
    port_env = os.environ.get("SMTP_PORT")
    mode = os.environ.get("SMTP_MODE")  # 'ssl' | 'starttls'

    if host and port_env:
        return host, int(port_env), (mode or "ssl")

    domain = user.split("@", 1)[1].lower() if "@" in user else ""
    profile = SMTP_PROFILES.get(domain)
    if profile:
        return profile
    fail(f"无法为 {user} 自动选择 SMTP,请显式设置 SMTP_HOST / SMTP_PORT (SMTP_MODE)")


def build_message(
    to_addr: str,
    spec: dict,
    from_name: str,
    from_addr: str,
    reply_to: str,
    cn_domains: set[str],
) -> EmailMessage:
    bilingual = "subject_cn" in spec
    if bilingual:
        lang = pick_lang(to_addr, cn_domains)
        subject = spec["subject_cn"] if lang == "cn" else spec["subject_en"]
        body = spec["body_cn"] if lang == "cn" else spec["body_en"]
    else:
        subject = spec["subject"]
        body = spec["body"]

    msg = EmailMessage()
    msg["From"] = formataddr((from_name, from_addr))
    msg["To"] = to_addr
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to
    msg["Message-ID"] = make_msgid(domain=from_addr.split("@", 1)[1])
    msg["X-Auto-Response-Suppress"] = "All"
    msg["Auto-Submitted"] = "auto-generated"
    msg.set_content(body)
    return msg


def open_smtp(host: str, port: int, mode: str, user: str, pwd: str) -> smtplib.SMTP:
    ctx = ssl.create_default_context()
    if mode == "ssl":
        s = smtplib.SMTP_SSL(host, port, context=ctx, timeout=30)
    else:  # starttls
        s = smtplib.SMTP(host, port, timeout=30)
        s.ehlo()
        s.starttls(context=ctx)
        s.ehlo()
    s.login(user, pwd)
    return s


def main() -> None:
    if len(sys.argv) < 2:
        fail("用法: python send_email.py <spec.json> [--send]")
    spec_path = sys.argv[1]
    dry_run = "--send" not in sys.argv[2:]

    spec = load_spec(spec_path)
    cn_domains = set(spec.get("cn_domains") or DEFAULT_CN_DOMAINS)
    recipients: list[str] = spec["recipients"]
    interval = float(spec.get("interval_seconds", 1.5))

    from_name = os.environ.get("SMTP_FROM_NAME") or spec.get("from_name") or "Sender"

    if dry_run:
        user = os.environ.get("SMTP_USER", "preview@example.com")
        pwd = ""
    else:
        user = os.environ.get("SMTP_USER") or fail("未设置 SMTP_USER")
        pwd, pwd_env = resolve_password(user)
        if not pwd:
            if pwd_env == "SMTP_PASS":
                fail(f"未找到密码。请设置 SMTP_PASS 环境变量(域名 {user.split('@', 1)[-1]} 没有专用映射)")
            else:
                fail(f"未找到密码。请设置 {pwd_env}(按域名匹配,推荐)或通用的 SMTP_PASS")

    from_addr = os.environ.get("SMTP_FROM_EMAIL") or user
    reply_to = os.environ.get("REPLY_TO") or spec.get("reply_to") or from_addr

    if dry_run:
        host, port, mode = "(dry-run)", 0, "skipped"
    else:
        host, port, mode = resolve_smtp(user)

    print(f"SMTP     : {host}:{port} ({mode})")
    print(f"From     : {from_name} <{from_addr}>")
    print(f"Reply-To : {reply_to}")
    print(f"收件人   : {len(recipients)}")
    print(f"间隔     : {interval}s")
    print("-" * 60)

    if dry_run:
        print(">>> DRY RUN 预览(未发送),加 --send 才会真正发出 <<<\n")
        for addr in recipients:
            msg = build_message(addr, spec, from_name, from_addr, reply_to, cn_domains)
            lang = pick_lang(addr, cn_domains) if "subject_cn" in spec else "-"
            print(f"  [{lang:2}] -> {addr:40}  {msg['Subject']}")

        # 选一个示例打印正文
        if "subject_cn" in spec:
            print("\n--- 中文样例 ---")
            m = build_message("preview@qq.com", spec, from_name, from_addr, reply_to, cn_domains)
            print(f"Subject: {m['Subject']}\n\n{m.get_content()}")
            print("--- 英文样例 ---")
            m = build_message("preview@example.com", spec, from_name, from_addr, reply_to, cn_domains)
            print(f"Subject: {m['Subject']}\n\n{m.get_content()}")
        else:
            print("\n--- 正文样例 ---")
            m = build_message(recipients[0], spec, from_name, from_addr, reply_to, cn_domains)
            print(f"Subject: {m['Subject']}\n\n{m.get_content()}")
        return

    sent, failed = 0, []
    try:
        s = open_smtp(host, port, mode, user, pwd)
    except smtplib.SMTPAuthenticationError as e:
        fail(f"SMTP 认证失败 (Gmail 必须用 App Password): {e}")
    except Exception as e:
        fail(f"SMTP 连接失败: {e}")

    try:
        for i, addr in enumerate(recipients, 1):
            msg = build_message(addr, spec, from_name, from_addr, reply_to, cn_domains)
            try:
                s.send_message(msg)
                sent += 1
                print(f"[{i:03}/{len(recipients)}] ✓ {addr}")
            except Exception as e:
                failed.append((addr, str(e)))
                print(f"[{i:03}/{len(recipients)}] ✗ {addr}  {e}")
            if i < len(recipients):
                time.sleep(interval)
    finally:
        try:
            s.quit()
        except Exception:
            pass

    print("-" * 60)
    print(f"完成: 成功 {sent} / 失败 {len(failed)}")
    if failed:
        print("失败清单:")
        for addr, err in failed:
            print(f"  - {addr}: {err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
