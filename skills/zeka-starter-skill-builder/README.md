# zeka-starter-skill-builder

用于为 Zeka Stack 的具体 Spring Boot Starter 模块生成符合 SkillsJars 规范的中文 `SKILL.md`。

> `SKILL.md` 是给 Agent 看的工作流程；本文件是给维护者看的简要说明。

## 适用场景

- 新增一个 `*-starter` 后，需要同步补充 SkillsJars `SKILL.md`
- 一个组件下有多个 starter，需要为每个 starter 分别生成 AI 使用说明
- 已有 starter 的 Skill 不符合 Zeka Stack 约定，需要调整目录、内容或选型说明

## 核心约定

- `SKILL.md` 写到具体 starter 模块下：

```text
<starter-module>/skills/<starter-artifact-id>/SKILL.md
```

- 不写到组件根目录、`core`、`common`、`autoconfigure`、`src/main/resources` 或 `META-INF/skills`
- 内容必须自包含，不引用 `README.md`、`docs/`、示例工程等不会打进 JAR 的仓库文件
- 生成前必须读取整个组件上下文，而不是只看 starter 自身的 `pom.xml`
- 同组件多个 starter 时，每个 starter 单独生成，并在正文中加入选型对比
- 默认不添加 `allowed-tools`

## 解包验证

在依赖目标 starter 的使用方项目中执行完整坐标命令：

```bash
mvn com.skillsjars:maven-plugin:0.0.7:extract -Ddir=.cursor/skills
```

或：

```bash
./mvnw com.skillsjars:maven-plugin:0.0.7:extract -Ddir=.cursor/skills
```

`extract` 只解析当前 Maven 项目依赖图中的 JAR，以及 SkillsJars Maven 插件自身的 plugin dependencies；不会扫描本地 `.m2` 中所有已安装的 JAR。

## 文件结构

```text
supports/skills/zeka-starter-skill-builder/
├── README.md
└── SKILL.md
```
