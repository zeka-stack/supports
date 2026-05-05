---
name: send-email-batch
description: Polish a rough email draft and batch-send it to a recipient list via SMTP, with a mandatory two-stage confirmation (dry-run preview first, explicit user approval required before actually sending). Supports automatic Chinese/English routing based on recipient domain. Use when the user asks to "send an email to these addresses", "给这些邮箱发邮件", "批量发送通知邮件", "给用户发一封邮件", or provides a rough email intent plus a recipient list.
---

# Send Email Batch

把用户提供的"一段粗糙的邮件意图 + 一份收件人列表"变成一次**经用户确认后才真正发出**的批量邮件。

## 核心原则

1. **永远先 dry-run,永远等用户二次确认**。即使用户上来就说"发送",也必须先打印预览,询问确认,收到**明确的**"发送/send/确认"类回复后才加 `--send`。
2. 邮件是**不可撤销操作**。任何疑问(收件人名单、主题、正文语气)都要先问用户,不要猜。
3. **不要**把 SMTP 密码写进 spec 文件或 shell 历史可见的地方。密码通过按域名匹配的环境变量传入(见下表),兜底变量是 `SMTP_PASS`。

   | 发件邮箱域名 | 密码环境变量(首选) |
   |---|---|
   | `@gmail.com` | `GMAIL_SMTP_PASS` |
   | `@qq.com` | `QQ_SMTP_PASS` |
   | `@163.com` / `@126.com` | `NETEASE_SMTP_PASS` |
   | `@outlook.com` / `@hotmail.com` / `@live.com` | `OUTLOOK_SMTP_PASS` |
   | 其他 | `SMTP_PASS` |

## 工作流程

```
[ ] 1. 收集素材: 收件人 + 粗糙内容 + 发件账号
[ ] 2. 打磨内容: 去 AI 味,必要时生成中英双语
[ ] 3. 写 spec.json 到 /tmp
[ ] 4. 跑 dry-run,打印预览给用户
[ ] 5. 等用户明确确认
[ ] 6. 跑 --send,报告结果
```

### 步骤 1:收集素材

必须明确的四件事:

- **收件人列表**:用户提供的原始地址,按顺序去重,保留原始大小写
- **发送意图**:用户想传达什么(道歉/通知/感谢/更新说明等)
- **发件账号**:哪个 `SMTP_USER`。如果是 Gmail,提醒用户用 **App Password** 而不是登录密码(https://myaccount.google.com/apppasswords)
- **语言策略**:看收件人域名。如果全是 `.com/.net/外国域名` → 英文单语;全是 `qq.com/163.com` 等 → 中文单语;**混合**则用双语模式,按收件人域名自动路由

如果这四件事用户没全部给出,用 AskQuestion 或直接追问,**不要猜**。

### 步骤 2:打磨内容

把用户的原始想法改写成自然、简洁、有人味的邮件。遵守以下准则:

- 第一人称、口语化,像一个技术朋友在写邮件,不是营销文案
- 主题行**具体且不卖惨**:"FreeAI fix for IDEA 2026.1" 好过 "重要通知!!!"
- 开头一句话感谢/说明背景,中间一句话讲清事情,结尾给出链接/联系方式
- **严禁** AI 味词汇:excited/thrilled/leverage/utilize/seamlessly/in this rapidly evolving landscape
- **严禁** 三段式排比("not only... but also... and also...")、过度破折号、夸张比喻
- 中文不用"赋能/闭环/抓手/链路打通"这类黑话;英文不用 "dive into/unlock/empower"
- 段落短,每段 2-3 行;链接单独成行或用 bullet,不要塞在句子里
- 落款用用户提供的发件人名

如果生成了内容,**打印给用户看**,问"是否按这个文案发送"。允许用户说"把中文那段改成 XX"这类微调。

### 步骤 3:写 spec.json

在 `/tmp/send-email-<timestamp>.json` 写一份 spec(绝对路径、防止污染项目目录)。schema:

```json
{
  "recipients": ["a@x.com", "b@y.com"],
  "from_name": "dong4j (IntelliAI Engine)",
  "reply_to":  "dong4j@gmail.com",

  // 单语模式:
  "subject": "...",
  "body":    "...",

  // 或者双语模式(任一语种字段存在就自动走双语):
  "subject_cn": "...",
  "body_cn":    "...",
  "subject_en": "...",
  "body_en":    "...",

  "interval_seconds": 1.5
}
```

写文件只用 Write 工具,不要用 `echo` / heredoc 避免转义问题。

### 步骤 4:Dry-run 预览

```bash
python3 ~/.cursor/skills/send-email-batch/scripts/send_email.py /tmp/send-email-XXX.json
```

dry-run 会打印:每个收件人对应的主题 + 中/英语言标记 + 正文样例。把完整输出展示给用户。

### 步骤 5:二次确认(强制)

对用户这样说:

> 上面是 dry-run 预览,共 N 封。确认以下内容:
> - 发件账号: `xxx@gmail.com`
> - 主题: ...
> - 收件人数: N
>
> 要真正发送,请回复 **"发送"** 或 **"send"**。想改动请直接说。

等用户明确回复"发送 / send / 确认 / yes" 再继续。用户说任何其他话(包括"看起来不错")都当作**未确认**,继续追问或修改。

### 步骤 6:真正发送

需要 `SMTP_USER` + 对应的密码环境变量(Gmail 用 `GMAIL_SMTP_PASS`,详见上表)。Gmail 必须用 App Password。

```bash
# 使用 shell 的 background=false,让用户看到进度;timeout 给足
python3 ~/.cursor/skills/send-email-batch/scripts/send_email.py /tmp/send-email-XXX.json --send
```

脚本会打印每封 ✓/✗,末尾给成功/失败统计。**失败清单要完整转述给用户**,建议他挑出失败地址重发一次(写一个新 spec 只包含失败列表即可)。

发送完成后,**删除** `/tmp/send-email-*.json`(里面没有密码,但可能有用户邮箱列表,清理干净)。

## SMTP 自动识别

脚本会按 `SMTP_USER` 域名自动选 SMTP 服务器,常见提供商无需额外配置:

| 域名 | 自动使用 |
|---|---|
| `@gmail.com` | smtp.gmail.com:465 (SSL),**必须 App Password** |
| `@qq.com` | smtp.qq.com:465 (SSL),**需要授权码** |
| `@163.com` / `@126.com` | smtp.163.com:465 / smtp.126.com:465,**需要授权码** |
| `@outlook.com` / `@hotmail.com` | smtp-mail.outlook.com:587 (STARTTLS) |
| 其他 | 必须 `export SMTP_HOST=... SMTP_PORT=... SMTP_MODE=ssl|starttls` |

## 常见错误与处理

| 错误 | 说明 | 建议 |
|---|---|---|
| `SMTPAuthenticationError 535 5.7.8` | 密码错,或 Gmail 用了登录密码 | 去 https://myaccount.google.com/apppasswords 生成 App Password |
| `ssl.SSLEOFError: UNEXPECTED_EOF_WHILE_READING` | 本地代理劫持了 DNS (Clash/Surge TUN 模式) 但没代理 SMTP | 让用户暂时关代理,或在代理规则里加 `DST-PORT,465,PROXY` |
| `SMTPRecipientsRefused` | 某些地址被拒 | 记录下来,别的照发;最后报告给用户 |
| 发 Gmail 超过 500/天 | 个人 Gmail 每日上限 | 达上限前停,或分多天发 |

## 反模式(不要这么做)

- ❌ 用户一句"发吧"就直接 `--send`,没有 dry-run 预览
- ❌ 把所有收件人塞到一个 `To:` 字段里(会暴露所有人邮箱) — 脚本已保证单封单发,**不要**改这个行为
- ❌ 直接在 shell 里 `echo "密码" > spec.json`,密码落盘
- ❌ 发送失败后自动重试(可能导致重复发送),交给用户决定是否重发
- ❌ 在邮件里塞 emoji 火箭 / 烟花 / 🎉 营销味;除非用户明确要求

## 极简示例

用户:
> 我要给 a@qq.com 和 b@gmail.com 发邮件,内容是告知 X 服务今晚 23:00 停机维护 1 小时。发件人 dong4j@gmail.com。

Agent 动作:
1. 因为收件人中英混合,生成双语内容
2. 写 `/tmp/send-email-20260418.json`,包含 `subject_cn/body_cn/subject_en/body_en`
3. 跑 dry-run,打印给用户
4. 问用户:"确认发送请回复 '发送'。"
5. 收到"发送"后跑 `--send`
6. 汇报成功/失败,清理 spec 文件
