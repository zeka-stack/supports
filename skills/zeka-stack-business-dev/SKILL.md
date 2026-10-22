---
name: zeka-stack-business-dev
description: 使用 Zeka Stack 新建业务项目、开发 CRUD 或复杂业务接口、选择封装工具与组件、审查工程规范时使用。
license: MIT
---

# Zeka Stack 业务开发

## 执行顺序

先读业务项目 AGENTS、POM 和同类实现，确认 Java、框架版本、数据库及 Servlet / Reactive 类型。使用 `zeka arch` 获取完整工程规范，`zeka list` 选择 starter，`zeka doc <artifactId>` 查组件 Skill，`zeka search <keyword>` 查公开类型与方法。不确定的方法先查签名，禁止凭经验编造。

没有 CLI 时，以下核心规则仍然适用；需要组件特定能力时读取随实际依赖解出的 starter Skill。

## 必须遵守的业务范式

1. 业务 parent 为 `dev.dong4j:arco-business-parent`，版本由项目确认；使用 `cubo-boot-dependencies` BOM。Servlet + MyBatis 可选 `cubo-ssm-spring-boot-starter`，其已含 framework、REST、OpenAPI、endpoint、MyBatis 和 Actuator。不要重复堆 starter。
2. 启动类 `@SpringBootApplication` 并 `extends ZekaStarter`，默认不额外写 main。默认根包 `dev.dong4j.zeka`；自定义根包需要 JVM `-DPARENT_PACKAGE_NAME=...`，验证启动扫描和响应包装。
3. 按业务模块组织 controller、service、service/impl、dao、entity/po、entity/dto、entity/form、entity/converter。XML 在 resources/mappers，Query 在 entity/form。
4. Servlet Controller 使用 `@RestControllerWrapper` 并继承 `ServletController`，构造注入 Service，直接返回 DTO / IPage / void。统一 Advice 包装 Result；显式 Result 的既有实现保持一致；原始下载使用 `@OriginalResponse`。Reactive 不套用 Servlet 规范。
5. Service 接口继承 `BaseService<PO>`；实现继承 `BaseServiceImpl<Mapper, PO>`。DAO 继承 `BaseDao<PO>`，不新建裸 BaseMapper 体系，不让 Controller 注入 DAO。
6. PO 按表选择 BasePO（id）、BaseWithTimePO（id + 时间）、BaseWithLogicPO（id + deleted）或 BaseExtendPO（id + 时间 + deleted）。不要重复定义基类字段，PO 不用 SuperBuilder。
7. Form extends BaseForm，DTO extends BaseDTO，Query extends BaseQuery。简单 CRUD 的 Service 可接受 Form / Query，转换后执行业务；复杂场景明确命令和领域边界。公开响应不返回 PO。
8. MapStruct Converter 继承 `ExtendConverter<Form, DTO, PO>`，调用 `f2p` / `p2d` / `d2p`；不使用已废弃 po / dto。输出映射明确排除敏感字段。
9. 业务错误枚举 implements `LowestExceptionAssert`，用枚举 `.notNull/.isTrue/.notBlank/.fail`；通用约束使用 `BaseCodes`。不自建响应类、不 catch 后返回 Map、不虚构 ResultCodeEnum。
10. 写操作明确 Service 事务，必要时 `@Transactional(rollbackFor = Exception.class)`。普通新增用 insert；insertIgnore 仅用于业务明确定义的忽略冲突场景。
11. 使用 Jakarta Validation、OpenAPI 注解和分组。更新校验路径与 Form ID 一致，启用 UpdateGroup 时考虑 Default；分页限制和排序白名单放在服务端。
12. 新类与关键方法写清业务约束。复用 Jsons、StringUtils、CollectionUtils、ConfigKit 等已有封装，先查 API 再调用；不得复制通用工具制造新 Utils。

## 标准开发流程

### 新建项目

确认 parent/BOM 能在当前仓库源解析，再选择单模块或既有多模块结构。不要为了套框架擅自修改现有根包、构建或 Java 版本。准备数据库配置，继承 ZekaStarter；使用 `zeka demo` 对照完整文件范例。

### 开发业务模块

先给出实体关系、表字段、接口、错误码、授权、事务边界。已有生成器时复用 `AutoGeneratorCodeBuilder`，根据实际表选择模板；生成后删除 autoField/TODO，核对继承基类与真实列。按 PO → Form/Query/DTO → Converter → DAO → Service → Controller 顺序实现，不把样例类名留到交付代码。

### 选择封装

优先查询用途再选类型：持久化用 MyBatis 基类，字典用 DictionaryService，消息用 MessagingTemplate + UnifiedMessage。发送方法为 sendSync/sendAsync/sendOneWay；监听注解必须有 topic、groupId。不要假定框架自动完成消息幂等、分布式事务或所有技术栈的相同响应包装。

### 检查与交付

运行 `zeka usage <project>`、`zeka doctor <project>`、`zeka lint <project>`。这些是只读启发式检查，不是 Java 编译。按项目允许的命令验证成功/错误响应、参数校验、事务回滚、分页和敏感字段；使用项目 Wrapper。交付时列出实际修改、复用的框架能力、测试证据与未验证项。用户禁止构建时，明确说明没有运行构建。

## 禁止事项

- 自建 ApiResponse、全局异常处理器或重复基础设施而没有明确需求。
- Controller 直连 Mapper、字段 Autowired/Resource 注入、PO 作为公开接口模型。
- 以聚合 POM artifact 代替具体 starter，混用 Servlet 和 Reactive。
- 手写未经核对的配置键、类名、Bean 覆盖条件或源码不存在的 API。
- 把代码扫描通过说成业务可靠性、授权或消息一致性已验证。
