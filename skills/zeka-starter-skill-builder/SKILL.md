---
name: zeka-starter-skill-builder
description: 为 Zeka Stack 的 Spring Boot Starter 模块生成符合 SkillsJars 规范的中文 SKILL.md，适用于新增 starter、补齐 starter skill、拆分多实现 starter skill 或调整 starter AI 使用说明。
---

# Zeka Starter Skill Builder

## 目标

使用本 Skill 为 Zeka Stack 的具体 `*-starter` 模块生成 SkillsJars 可打包的中文 `SKILL.md`。

生成结果必须让使用方在只依赖 starter JAR 并执行 SkillsJars extract 后，也能获得完整、可执行、无外部仓库路径依赖的 AI 使用说明。这个说明不是给人浏览的普通
README，而是给 AI Agent 写代码时使用的组件上下文。

合格的 starter `SKILL.md` 应让 AI 明确知道：

- 这个 starter 解决什么问题，适合什么项目场景。
- 它向使用方提供了哪些功能和默认能力。
- 推荐如何使用，包括依赖方式、典型编码方式和最佳实践。
- 有哪些配置项、默认行为和开关。
- 自动装配了哪些关键 Bean。
- 使用方如果要自定义或覆盖 Bean，应该如何做、应该避免什么。
- 与同组件其他 starter 如何选型。
- 哪些写法会绕过 Zeka Stack 封装，应明确禁止。

## 核心原则

### 1. 写到具体 starter 模块下

`SKILL.md` 必须写到使用方会直接依赖的 starter 模块中，而不是上层聚合模块，也不是 `core`、`common`、`autoconfigure` 等底层模块。

正确结构：

```text
<starter-module>/
└── skills/
    └── <starter-artifact-id>/
        └── SKILL.md
```

示例：

```text
cubo-rest-servlet-spring-boot-starter/
└── skills/
    └── cubo-rest-servlet-spring-boot-starter/
        └── SKILL.md
```

不要写到：

```text
<component-root>/skills/<component-name>/SKILL.md
src/main/resources/
META-INF/skills/
```

`META-INF/skills/...` 是 SkillsJars Maven 插件打包后的输出目录，不是源码目录。

### 2. 内容必须自包含

starter JAR 通常只会打包当前 starter 模块的 `skills/` 内容。使用方执行 extract 后，看不到源码仓库里的 `README.md`、`docs/`、示例工程或其他
Markdown。

因此，生成的 `SKILL.md` 不能包含这些引用：

```text
参考 README.md
参考 docs/detail-xxx.md
参考 cubo-starter-examples/xxx
更多说明见某个仓库路径
```

必要的使用约束、选型规则、编码规则和禁止事项必须直接写进 `SKILL.md` 正文。

### 3. 生成前必须读取整个组件上下文

starter 模块经常只有 `pom.xml`，真正能力分布在同一个组件下的 `core`、`common`、`autoconfigure`、实现模块和测试中。生成 `SKILL.md` 时，不能只看
starter 自身。

最少读取：

- 目标 starter 的 `pom.xml`
- 同一个组件根目录的聚合 `pom.xml`
- starter 依赖的 `core`、`common`、实现模块、`autoconfigure` 的关键代码
- 自动配置类、配置属性类、条件装配注解、异常处理类、公共模型、扩展点
- `@Bean` 方法、`@ConditionalOnMissingBean`、`@ConditionalOnProperty`、`@ConfigurationProperties`
- `spring.factories`、`AutoConfiguration.imports`、SPI 文件等自动装配入口
- 同一组件下其他 starter 的 `pom.xml` 和功能差异

目标是写出“使用这个 starter 时 AI 应该如何编码”的规则，而不是复述 starter POM。

### 4. 每个独立 starter 单独生成

一个组件下可能有多个 starter，每个 starter 都是使用方可独立依赖的入口，因此每个 starter 都应有自己的 `SKILL.md`。

示例：

```text
cubo-rest-servlet-spring-boot-starter
cubo-rest-reactive-spring-boot-starter
cubo-messaging-kafka-spring-boot-starter
cubo-messaging-rocketmq-spring-boot-starter
```

不要用一份上层组件 Skill 同时覆盖多个实现，除非这个上层模块本身就是使用方直接依赖的 starter。

### 5. 必须提供选型说明

每份 `SKILL.md` 都应说明该 starter 的适用场景和选型建议，帮助 AI 和使用方避免错误选型。如果同一组件下有多个 starter，应说明其他 starter
的适用场景；如果只有一个 starter，应说明该 starter 与其他技术栈（如传统 Spring Boot 应用）的差异。

推荐使用 Markdown 表格：

```markdown
| 场景 | 推荐 starter | 说明 |
| --- | --- | --- |
| 传统 Spring Boot 应用 | 直接使用 Spring Boot | 不需要 Zeka Stack 启动器 |
| Zeka Stack 应用 | `cubo-launcher-spring-boot-starter` | 统一生命周期管理和配置热更新 |
```

表格内容必须来自真实模块结构和依赖关系，不要凭名称猜测。

### 6. 默认不要添加 allowed-tools

不要在 frontmatter 中添加 `allowed-tools`。

`allowed-tools` 不是 Maven 命令清单，而是 Agent 工具权限声明。SkillsJars Maven 插件会校验 `allowed-tools` 对应的 POM
property；无明确需求时添加它只会增加维护成本和打包失败风险。

Maven 命令应写在正文的验证说明中，而不是写进 frontmatter。

## 生成流程

### Step 1：确认目标 starter

先确认用户指定的是具体 starter 模块。如果用户只给了组件根目录，先列出该组件下的 starter，并说明会为哪些 starter 生成 `SKILL.md`。

判断方式：

- 模块 artifactId 通常以 `-starter` 结尾。
- 使用方业务项目会直接依赖该 starter。
- 该 starter 的 POM 会引用底层实现模块和外部框架依赖。

### Step 2：读取模块结构

读取目标组件目录下的 Maven 模块关系，确认：

- 组件根 artifactId
- 所有 starter artifactId
- 每个 starter 依赖哪些内部模块
- 是否存在 Servlet / Reactive、Kafka / RocketMQ、Dubbo / Knife4j 等实现变体

推荐命令：

```bash
find <component-root> -maxdepth 4 -name pom.xml | sort
rg -n "<artifactId>|<module>|<dependency>" <component-root> -g pom.xml
```

### Step 3：读取实现代码

根据 starter 依赖关系读取真实实现，不要只读 starter POM。

重点关注：

- 自动配置类
- 配置属性类
- starter 引入的核心实现类
- 统一模型，例如响应、异常、消息、端点、拦截器
- 扩展点和用户可覆盖的 Bean
- 与同组件其他 starter 的差异

读取后先形成一份内部理解，再写 `SKILL.md`。至少回答这些问题：

| 问题                     | 需要从哪里确认                                          |
|------------------------|--------------------------------------------------|
| starter 暴露给使用方的核心能力是什么 | starter 依赖、核心实现、自动配置类                            |
| 使用方应该写什么类型的业务代码        | controller、service、mapper、listener、endpoint 等实现类 |
| 自动配置了哪些 Bean           | `@Bean` 方法、自动配置类、条件装配注解                          |
| 哪些 Bean 允许用户覆盖         | `@ConditionalOnMissingBean`、扩展接口、配置属性            |
| 配置项有哪些                 | `@ConfigurationProperties`、配置常量、条件装配属性           |
| 默认行为是什么                | 自动配置、默认 Bean、默认属性值                               |
| 什么情况下应该换用其他 starter    | 同组件其他 starter 或其他技术栈（如传统 Spring Boot）的差异         |
| 哪些底层模块对使用方透明           | core/common/autoconfigure 依赖和封装关系                |

### Step 4：生成 SKILL.md

每个 starter 生成一份中文 `SKILL.md`，路径为：

```text
<starter-module>/skills/<starter-artifact-id>/SKILL.md
```

推荐结构：

```markdown
---
name: <starter-artifact-id>
description: 在使用 Zeka Stack <Starter 名称> 编写相关功能时使用。
license: Apache-2.0
---

# <Starter Name>

## 适用场景

说明什么时候使用这个 starter。

## 组件定位

说明这个 starter 暴露给使用方的能力，以及它屏蔽了哪些底层模块。

## 功能能力

列出这个 starter 提供给使用方的主要功能。不要只说“集成某框架”，要说明它帮业务项目省掉了哪些配置、封装了哪些工程约定、提供了哪些默认能力。

## 依赖方式

给出 Maven dependency 片段。

## 与同组件其他 Starter 的选型

用表格说明同组件其他 starter 的推荐场景和不推荐场景。如果同一组件只有一个 starter，应用表格说明该 starter 与其他技术栈（如传统 Spring Boot 应用）的差异，帮助 AI 正确选型。

## 使用方式与最佳实践

说明 AI 在业务项目中应该如何使用这个 starter 编写代码，包括推荐的类、注解、接口、返回模型、异常模型、消息模型或端点模型。

## 编码规则

列出 AI 生成业务代码时必须遵守的规则。

## 配置规则

列出配置属性、默认值、开关条件和配置注意事项。**属性名必须从源码中的 `@ConfigurationProperties` 类或 `@ConditionalOnProperty` 注解确认，不确定时说明需要查阅配置属性类（如 `XxxProperties.java`）。不要编造属性名。**

## 自动装配的 Bean

列出这个 starter 会自动装配的关键 Bean、作用和生效条件。只列对使用方有意义的 Bean，不要堆砌内部辅助对象。

推荐格式：

```markdown
| Bean / 类型 | 作用 | 生效条件 | 自定义方式 |
| --- | --- | --- | --- |
| `XxxService` | 提供 xxx 能力 | 缺少用户自定义 Bean 时 | 声明同类型 Bean 覆盖 |
```

## 自定义与覆盖方式

说明使用方如何扩展或覆盖默认行为，例如：

- 声明同类型 Bean 覆盖 `@ConditionalOnMissingBean` 默认 Bean。
- 通过配置属性调整默认行为。
- 实现扩展接口接入自定义逻辑。
- 在不破坏 starter 自动配置边界的前提下增加业务 Bean。

必须说明覆盖时的风险，例如不要重复注册全局处理器、不要绕过统一模型、不要混用不兼容的实现栈。

## 不要这样做

列出常见错误、错误选型、绕过 starter 封装、混用实现栈等禁忌。

```

### Step 5：检查自包含性

生成后检查 `SKILL.md` 中是否残留不可见路径或外部文档引用。

推荐命令：

```bash
rg -n "参考|README|docs/|examples|cubo-starter/|cubo-starter-examples|更多说明" <starter-module>/skills
```

出现命中时，优先把必要内容改写进正文，而不是保留引用。

### Step 6：检查 SkillsJars 父 POM 配置

确认组件继承链中已经配置 SkillsJars Maven 插件，并使用默认目录：

```xml
<skillsDir>${project.basedir}/skills</skillsDir>
```

如果插件已在组件父 POM 中统一配置，不要在每个 starter POM 中重复添加。

## 解包验证说明

生成 `SKILL.md` 后，发布方需要先打包或安装对应 starter JAR。使用方或验证项目必须依赖目标 starter，之后执行完整坐标命令：

```bash
mvn com.skillsjars:maven-plugin:0.0.7:extract -Ddir=.cursor/skills
```

或：

```bash
./mvnw com.skillsjars:maven-plugin:0.0.7:extract -Ddir=.cursor/skills
```

不要只写：

```bash
mvn skillsjars:extract -Ddir=.cursor/skills
```

短前缀命令依赖 Maven plugin prefix 解析，可能因为未配置 `pluginGroups` 而失败。

### Extract 原理

`extract` 只解析当前 Maven 项目依赖图中的 JAR，以及 SkillsJars Maven 插件自身的 plugin dependencies。它不会扫描本地 `.m2` 中所有已经安装的
JAR，也不会扫描 reactor 中所有模块的 `target/classes`。

如果验证项目只依赖一个 starter，只会解出这个 starter 的 Skill。要验证多个 starter，需要让验证项目同时依赖这些 starter。

解包后的目录形态通常类似：

```text
.cursor/skills/
└── skillsjars__<org>__<repo>__<skill-name>/
    └── SKILL.md
```

## 质量标准

合格的 starter `SKILL.md` 应满足：

- 路径符合 `skills/<starter-artifact-id>/SKILL.md`。
- frontmatter 至少包含 `name`、`description`、`license`。
- `name` 与 starter artifactId 一致。
- 正文为中文，技术术语可保留英文。
- 内容自包含，不引用使用方不可见的仓库文档。
- 明确说明 starter 的适用场景、组件定位、功能能力、依赖方式、最佳实践、编码规则、配置规则和禁止事项。
- 明确说明自动装配的关键 Bean，以及使用方如何自定义或覆盖这些 Bean。
- 对配置项和 Bean 不确定时，不要编造名称；应回到真实代码确认。
- 如果同组件存在多个 starter，包含选型对比。即使同一组件只有一个 starter，也应用表格说明该 starter 与其他技术栈 starter（如传统 Spring Boot
  应用）的差异，帮助 AI 正确选型。
- 不添加 `allowed-tools`。
- 不重复配置已由父 POM 管理的 SkillsJars Maven 插件。
