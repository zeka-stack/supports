# supports

Zeka.Stack 支撑模块

## 初始化 Zeka.Stack

因为 Zeka.Stack 是由多个 Git 项目组成, 所以为了方便快速搭建 Zeka.Stack 的本地目录结构:

### 使用方式

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/zeka-stack/supports/main/scripts/init-stack.sh)
```

### 目录结构

```
zeka.stack/
├── arco-meta/                 # Maven 构建体系与依赖管理的元模块集合
│   └── pom.xml                # 聚合 arco 系列构建模块
├── blen-toolkit/              # 工具集模块，提供桥接集成与跨模块共用逻辑
├── cubo-starter/              # Spring Boot 通用组件封装（核心 starter）
├── cubo-starter-examples/     # cubo-starter 的使用示例与测试工程
├── domi-suite/                # 微服务化项目集合（面向业务的基础能力）
│   └── pom.xml                # 聚合 domi 微服务模块
├── eiko-orch/                 # 二开的中间件或其他基础设施服务
│   └── pom.xml                # 聚合 eiko 基础设施模块
└── felo-space/                # 系统模块集合（业务应用层）
    └── pom.xml                # 聚合 felo 业务系统模块
```
