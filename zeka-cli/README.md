# Zeka CLI

Go 单二进制，为 AI 与开发者提供 Zeka Stack 工程规范、组件 Skills、已有类型/方法检索和只读业务代码检查。`zeka mcp` 通过官方 Go MCP SDK 暴露相同能力。

当前是 0.1.0 开发版本，知识对应本仓库的框架源码快照。没有发布公共二进制、远程安装包或历史版本知识库；以下命令从已检出的源码构建。

## 构建与使用

要求 Go 1.25、Python 3。完整框架仓库根目录执行：

```bash
make ai-generate
make zeka-cli-build
./supports/zeka-cli/bin/zeka list
./supports/zeka-cli/bin/zeka arch
./supports/zeka-cli/bin/zeka search Jsons
```

构建输出为 `supports/zeka-cli/bin/zeka`，该目录不入库。可将二进制复制到自己的 PATH；后续查询无需网络或框架源码。首次 Go 构建会下载 go.mod 中固定的依赖。

独立 supports 仓库中已有生成资源时，也可在 `zeka-cli` 目录运行 `go build -trimpath -o bin/zeka ./cmd/zeka`；重新生成资源需要完整框架 checkout。

## 命令

| 命令 | 作用 |
| --- | --- |
| `list` | starter 列表、来源、框架版本及扫描统计 |
| `info <starter> [--detail]` | Maven 直接依赖、继承入口、属性声明和自动配置来源；detail 附完整源码 |
| `doc <starter>` | 自包含 starter Skill |
| `arch` / `arch.md` | 统一工程规范 |
| `demo` | 包含 import、注释、SQL 契约及验收说明的完整账户模块 |
| `search <keyword> --limit 20` | 可复用类型与方法声明搜索，精确类名优先 |
| `usage <dir>` | 业务 POM 直接 Zeka 依赖和 Java Zeka imports |
| `doctor <dir>` | 聚合模块误用、单模块 Web 栈冲突、根包约束 |
| `lint <dir> --strict` | 常见业务代码反模式，附文件/行号/规则 |
| `skills extract --dir <dir>` | 默认只导出业务开发 Skill |
| `skills extract --dir <dir> --starter <name>` | 附带选定 starter 及其 starter 依赖 |
| `setup --client cursor --workspace <dir>` | 输出客户端 MCP 配置，不修改全局配置 |
| `mcp --workspace <dir>` | stdio MCP Server |
| `version` | CLI、框架与 schema 版本 |

starter 可使用唯一片段（例如 mybatis）；`rest` 等歧义输入会报错，不能默默选择某技术栈。`search` 同时检索包名、类说明和声明文本。方法索引不解析 Java 继承与重载兼容性；调用前确认模块依赖和实际版本。

文档默认原始 Markdown，其他结果默认缩进 JSON。`--format json` 将文档输出为 JSON 字符串；结构化数据的 text 格式同样为可读 JSON。参数可放在目标前或后。stderr 输出结构化错误，stdout 可安全管道读取。退出码：0 成功、1 查询或 IO 失败、2 参数错误、3 strict 扫描有 warning。

## Skill 导出

```bash
zeka skills extract --dir .agents/skills --starter cubo-ssm-spring-boot-starter
```

根据实际客户端选择技能目录；不要给一个项目自动加载所有互斥技术栈。CLI 在写入前检查冲突，已有不同内容拒绝覆盖；需要替换时先审阅，再显式加 `--force`。`--all` 为维护模式。导出不修改 AGENTS 或客户端配置。

组件 JAR 的 SkillsJars 提取反映实际依赖图，CLI 导出反映内嵌快照，两者不是自动版本同步。已有不同版本时先核对 API。

## MCP

```bash
zeka setup --client cursor --workspace /absolute/path/to/project
zeka mcp --workspace /absolute/path/to/project
```

支持 claude/cursor/vscode/codex 的配置输出。setup 使用当前可执行文件绝对路径，应先把二进制放到稳定位置再生成配置。

9 tools：zeka_list/info/doc/arch/demo/search/doctor/usage/lint。

2 prompts：zeka-expert(task)、zeka-module-generator(module)。

Resource：`zeka://arch.md`。

工具仅查询知识或只读扫描。项目 path 默认工作区，拒绝目录越界、工作区外符号链接；扫描不跟随文件链接，跳过构建和工具目录。扫描上限 20000 文件、单文件 8 MiB，支持取消。启动后 stdout 仅包含 JSON-RPC 数据；不打印启动横幅，不启 HTTP 端口。

## 知识生成与一致性

```bash
python3 supports/zeka-cli/scripts/generate.py
python3 supports/zeka-cli/scripts/generate.py --check
```

命令从框架根目录执行；脚本定位依赖自身路径，不依赖 shell 当前目录。

| 维护源 | 生成物 |
| --- | --- |
| 根目录 arch.md | CLI assets/arch.md、站点 public/arch.md |
| examples/account.md | CLI assets/demo.md、站点 public/zeka-demo.md |
| 业务 Skill | metadata.json、站点 public/SKILL.md |
| 15 个 starter Skill、POM、属性类和自动配置源码 | metadata.json |
| 各初始化工程源码与文档 | inventory.json（路径、类型、SHA-256） |

元数据从源码提取，不依赖 target。自动配置证据区分源码 import 描述文件和 `@AutoConfiguration` 注解；本框架通过注解处理器在编译时生成 import 文件，因此源码注解索引不声称已验证实际发布 JAR 的 imports。POM 只遍历本地模块与继承依赖，不实现完整 Maven 模型解析。

`--check` 比较全部派生文件且不写入，供 CI 检测源码变化后是否忘记重建。文档站生成与 CLI 编译应使用同一份已同步源码。

## 验证

```bash
make ai-check
make zeka-cli-test
python3 supports/zeka-cli/scripts/smoke_mcp.py supports/zeka-cli/bin/zeka
```

单元/协议测试覆盖 starter 元数据、歧义查询、反模式定位、模块隔离、符号链接/目录边界、Skill 冲突保护、MCP 的工具/提示/资源；smoke 脚本使用真实子进程 stdio 握手。

静态检查不解析完整 Maven 继承/Profiles，不验证 Java 类型、不执行应用、SQL 或构建。业务示例仍需在真实依赖、数据库和应用上下文中集成验证。首版不提供自动迁移、框架升级、发布和部署能力。
