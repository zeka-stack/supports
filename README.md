# supports

Zeka.Stack 支撑模块

## 初始化 Zeka.Stack

Zeka.Stack 是一个由多个 Git 项目组成的综合开发堆栈，包含了一系列模块和工具，旨在提供全面的开发支持。

### 初始化流程

使用初始化脚本：

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/zeka-stack/supports/main/scripts/init-stack.sh)
```

脚本会创建特定目录结构并克隆相关仓库

### 目录结构

```
zeka.stack/
├── arco-meta/                 # Maven 构建体系与依赖管理的元模块集合
│   └── pom.xml                # 聚合 arco 系列构建模块
├── blen-kernel/              # 工具集模块，提供桥接集成与跨模块共用逻辑
├── cubo-starter/              # Spring Boot 通用组件封装（核心 starter）
├── cubo-starter-examples/     # cubo-starter 的使用示例与测试工程
├── domi-suite/                # 微服务化项目集合（面向业务的基础能力）
│   └── pom.xml                # 聚合 domi 微服务模块
├── eiko-orch/                 # 二开的中间件或其他基础设施服务
│   └── pom.xml                # 聚合 eiko 基础设施模块
└── felo-space/                # 系统模块集合（业务应用层）
    └── pom.xml                # 聚合 felo 业务系统模块
```

### 为什么自动生成 pom.xml

本脚本 **只会在聚合模块目录下** 自动创建一个 pom.xml 文件，原因如下：

在 Zeka.Stack 中，我们按照分层架构组织多个独立的 Git 项目，每一层（如 arco-meta, domi-suite 等）聚合了若干同类模块。为了提升这些模块的统一管理和构建效率，我们为每个聚合目录生成一个聚合
POM（pom.xml）：

- ✅ **统一构建入口**：使用 mvn install 或 mvn deploy 即可一键构建该目录下的所有模块。
- ✅ **IDE 集成友好**：如 IntelliJ IDEA 可识别该目录为一个 Maven 项目，便于模块导入与依赖导航。

即使你不使用本脚本，我们也**强烈建议**在管理多个 Maven Git 仓库时，手动创建一个聚合 pom.xml，以实现更好的项目管理与协同构建。

### 为什么自动下载 .mvn文件

关于 `.mvn` 的详细说明请参考文章：[你可能忽略的 .mvn：Maven 本地化配置的秘密与坑点解析](xxx)。

`.mvn` 目录是 Maven 提供的本地化配置机制，支持定制：

- 本地仓库地址；
- 默认命令行参数（如并行构建线程数、跳过测试等）；
- 环境变量注入等高级能力。

> 💡 遗憾的是，Maven 父模块无法使用子模块的 .mvn 配置, 所以我们需要在聚合目录下生成 .mvn 相关的文件.

因此，脚本在生成聚合 pom.xml 后会 **自动从远程拉取 .mvn 目录和文件**，以确保每个聚合模块都具备本地化配置能力。

如果你是手动组织结构，也可以直接从此目录复制所需文件：

📁 https://github.com/zeka-stack/supports/tree/main/maven