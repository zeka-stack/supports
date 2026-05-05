# send-email-batch

一个 Cursor Agent Skill:**把一段粗糙的邮件意图 + 一份收件人列表,变成经二次确认后才真正发出的批量邮件**。

- 单封单发(不暴露其他收件人)
- 按收件人域名自动中英文分流
- 强制 dry-run 预览 + 用户明确确认后才发送
- SMTP 密码只走环境变量,**永远不进对话/不进文件**

> SKILL.md 是给 Agent 看的工作流程;本文件是给**你**看的使用说明。

---

## 一、装在哪

```
~/.cursor/skills/send-email-batch/
├── SKILL.md                # Agent 行为定义
├── README.md               # 本文件
└── scripts/
    └── send_email.py       # 底层发送脚本
```

Cursor 启动后自动发现 `~/.cursor/skills/` 下所有 skill,不需要额外配置。

---

## 二、一次性准备(只做一次)

### 1. Gmail 用户

Gmail 禁止 SMTP 用登录密码,必须用 **App Password**。

1. 打开 https://myaccount.google.com/security,确保"两步验证"已开启
2. 访问 https://myaccount.google.com/apppasswords
3. 起名(比如 `cursor-send-email`)→ 生成 → 复制那 16 位密码(形如 `abcd efgh ijkl mnop`,空格保留或删除都能用)

### 2. QQ 邮箱用户

登录 QQ 邮箱 → 设置 → 账户 → 开启 **POP3/IMAP/SMTP 服务** → 生成**授权码**。后续当密码用。

### 3. 163/126 邮箱用户

登录 → 设置 → POP3/SMTP/IMAP → 开启 SMTP → 生成**客户端授权密码**。

---

## 三、典型使用流程

### 触发 Skill

在 Cursor 聊天里用自然语言,Agent 会自动匹配到这个 skill。触发句式举例:

- "帮我给 `a@qq.com`、`b@gmail.com` 发邮件,内容是 X 服务今晚 23:00 停机 1 小时"
- "给这些邮箱发通知:xxx,yyy,zzz,告诉他们 X 功能已修复"
- "批量发送一封感谢信给 [邮箱列表]"

告诉 Agent 的时候**只给这四样**:

| 必须给 | 例子 |
|---|---|
| 收件人列表 | `a@qq.com b@gmail.com` |
| 邮件意图 | "告知 X 服务修复 / 通知 Y 活动 / 感谢 Z" |
| 发件账号(邮箱地址) | `dong4j@gmail.com` |
| 发件人署名(可选) | `dong4j` 或 `dong4j (IntelliAI Engine)` |

**不要**在聊天里给密码。Agent 不会要。

### Agent 会做什么

1. 打磨文案(去 AI 味、中英混合时自动双语)
2. 把 spec 写到 `/tmp/send-email-<timestamp>.json`
3. 跑 dry-run 打印预览给你看
4. **问你确认**:想改就说怎么改,要发就回复"发送"
5. 你回复"发送"后,给你一条 `--send` 命令让你自己跑(或由它代跑)

### 你要做什么(发送环节)

在**你自己的 zsh 终端**里(注意必须是同一个 shell):

```bash
# 开头留个空格可以避免进 shell history(需要 HIST_IGNORE_SPACE)
 export SMTP_USER="你的邮箱@gmail.com"
 export GMAIL_SMTP_PASS="16 位 App Password"      # 按域名匹配,推荐

# 然后执行 Agent 给的那条命令
python3 ~/.cursor/skills/send-email-batch/scripts/send_email.py /tmp/send-email-XXX.json --send
```

> **为什么叫 `GMAIL_SMTP_PASS` 而不是 `SMTP_PASS`?**
> 脚本按 `SMTP_USER` 的域名自动找对应的密码变量。这样你可以**同时**把 Gmail/QQ/163 的密码都放在 shell profile 里,互不干扰。`SMTP_PASS` 作为兜底,其他邮箱或自建域名才用它。

脚本会打印每封的 ✓/✗,末尾汇总成功/失败数。

---

## 四、SMTP / 密码变量自动识别

脚本根据 `SMTP_USER` 的域名自动选服务器**和**密码环境变量名:

| 邮箱域名 | 自动使用 | 协议 | 密码变量(首选) | 密码要求 |
|---|---|---|---|---|
| `@gmail.com` | smtp.gmail.com:465 | SSL | `GMAIL_SMTP_PASS` | **App Password** |
| `@qq.com` | smtp.qq.com:465 | SSL | `QQ_SMTP_PASS` | **授权码** |
| `@163.com` | smtp.163.com:465 | SSL | `NETEASE_SMTP_PASS` | **授权码** |
| `@126.com` | smtp.126.com:465 | SSL | `NETEASE_SMTP_PASS` | **授权码** |
| `@outlook.com` / `@hotmail.com` / `@live.com` | smtp-mail.outlook.com:587 | STARTTLS | `OUTLOOK_SMTP_PASS` | 账号密码 |
| 其他 | 需手动配置 SMTP | | `SMTP_PASS` | |

专用变量**找不到**时,全部回落到 `SMTP_PASS`,因此老的 `export SMTP_PASS=...` 依然有效(向后兼容)。

自建邮箱或其他提供商,手动设:

```bash
export SMTP_HOST="mail.example.com"
export SMTP_PORT="465"
export SMTP_MODE="ssl"       # 或 starttls
```

---

## 五、自己直接用脚本(不经 Agent)

不想走 Agent 对话,也可以直接写 spec.json 跑脚本。

### spec.json 格式

**单语模式**:

```json
{
  "recipients": ["a@example.com", "b@example.com"],
  "from_name": "dong4j",
  "subject": "邮件主题",
  "body": "邮件正文\n\n支持多行\n",
  "interval_seconds": 1.5
}
```

**双语模式**(按收件人域名自动路由中/英):

```json
{
  "recipients": ["a@qq.com", "b@gmail.com"],
  "from_name": "dong4j",
  "reply_to": "dong4j@gmail.com",
  "subject_cn": "中文主题",
  "body_cn": "中文正文...",
  "subject_en": "English subject",
  "body_en": "English body...",
  "interval_seconds": 1.5
}
```

所有字段含义见 [`scripts/send_email.py`](scripts/send_email.py) 顶部 docstring。

### 命令

```bash
# 预览(默认,不发送)
python3 ~/.cursor/skills/send-email-batch/scripts/send_email.py path/to/spec.json

# 真正发送(密码变量按发件邮箱选,例如 Gmail 用 GMAIL_SMTP_PASS)
export SMTP_USER="you@gmail.com"
export GMAIL_SMTP_PASS="xxxxxxxxxxxxxxxx"
python3 ~/.cursor/skills/send-email-batch/scripts/send_email.py path/to/spec.json --send
```

---

## 六、安全说明

| 项 | 实现 |
|---|---|
| 密码存储 | 只在**当前 shell 进程内存**,关掉终端就没了 |
| 密码是否落盘 | 否。spec.json **不含**密码字段 |
| 密码是否进对话上下文 | 否。Agent 永远不会问、不会打印、不会写入任何文件 |
| 收件人彼此是否可见 | **不可见**。脚本强制单封单发,没有 BCC/CC 拼接 |
| shell history 泄露风险 | 可控。`export` 前面加空格(zsh `HIST_IGNORE_SPACE`)即可不入 history |
| 邮件头 | 加了 `Reply-To` / `Auto-Submitted` / `X-Auto-Response-Suppress`,降低被反垃圾拦截概率 |

---

## 七、常见错误

| 错误 | 原因 | 处理 |
|---|---|---|
| `SMTPAuthenticationError 535 5.7.8 BadCredentials` | 用了登录密码而不是 App Password | 去 https://myaccount.google.com/apppasswords 生成,别用 Gmail 登录密码 |
| `ssl.SSLEOFError: UNEXPECTED_EOF_WHILE_READING` | 本地代理(Clash/Surge TUN 模式)劫持了 DNS 但没代理 SMTP 端口 | 暂时关代理,或在代理规则里加 `DST-PORT,465,PROXY` |
| DNS 解析到 `198.18.x.x` | 同上,fake IP | 同上 |
| `SMTPRecipientsRefused` | 某些地址被拒 | 记录下来单独处理,其他照发 |
| Gmail 超过 500 封/天 | 个人账号日发送上限 | 分多天发,或换 Workspace / 邮件服务商 |
| `无法为 xxx 自动选择 SMTP` | 脚本不认识域名 | 显式 `export SMTP_HOST / SMTP_PORT / SMTP_MODE` |

---

## 八、反模式(不要这么做)

- ❌ 把密码贴进 Cursor 对话框让 Agent "帮忙配置"
- ❌ 把 16 封收件人塞到一个 `To:` 里发一封(会暴露所有人的邮箱地址)
- ❌ 不经 dry-run 直接 `--send`
- ❌ 发送失败后自动循环重试(可能重复发送)
- ❌ 在 spec.json 里塞 `"smtp_password"` 字段(脚本**不会**读,但别养成这习惯)

---

## 九、手动测试一下

不想真发邮件,想验证 skill 能跑,跑这条(dry-run,不会发送,不需要密码):

```bash
cat > /tmp/test-spec.json <<'EOF'
{
  "recipients": ["test@qq.com", "test@example.com"],
  "from_name": "smoke test",
  "subject_cn": "测试",
  "body_cn": "测试正文",
  "subject_en": "Test",
  "body_en": "Test body"
}
EOF
python3 ~/.cursor/skills/send-email-batch/scripts/send_email.py /tmp/test-spec.json
rm /tmp/test-spec.json
```

能看到中英文分流的预览,就说明 skill 安装正常。
