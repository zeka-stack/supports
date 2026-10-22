# 账户模块参考实现

这是 Servlet + MyBatis 的最小业务范例，使用 `cubo-ssm-spring-boot-starter`，parent/BOM 按 `arch.md` 配置。每个代码块对应一个独立文件；示例不执行建表、不连接数据库。它展示当前源码 API，集成运行仍需实际数据库、依赖仓库和项目构建验证。

该表不含逻辑删除列，所以 PO 选择 BaseWithTimePO；如果表同时有 deleted，应改用 BaseExtendPO。创建不允许静默忽略重复数据，使用 insert，唯一约束异常的对外翻译应按实际业务补充。

## 数据库契约

```sql
CREATE TABLE demo_account (
    id BIGINT NOT NULL PRIMARY KEY,
    account_name VARCHAR(64) NOT NULL,
    create_time DATETIME NOT NULL,
    update_time DATETIME NOT NULL,
    UNIQUE KEY uk_account_name (account_name)
);
```

主键按应用 MyBatis 的 ID 策略配置；本示例 SQL 没有 AUTO_INCREMENT。时间字段交给框架填充。不要把示例 SQL 当成生产迁移。

## DemoApplication.java

```java
package dev.dong4j.zeka.demo;

import dev.dong4j.zeka.starter.launcher.ZekaStarter;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** 统一使用 Zeka 生命周期，避免旁路 SpringApplication 启动。 */
@SpringBootApplication
public class DemoApplication extends ZekaStarter {
}
```

## account/entity/po/Account.java

```java
package dev.dong4j.zeka.demo.account.entity.po;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import dev.dong4j.zeka.starter.mybatis.base.BaseWithTimePO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/** 持久层模型，时间和主键由基类管理，不对外暴露。 */
@Data
@NoArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = true)
@TableName("demo_account")
public class Account extends BaseWithTimePO<Long, Account> {
    public static final String ACCOUNT_NAME = "account_name";

    @TableField(ACCOUNT_NAME)
    private String accountName;
}
```

## account/entity/form/AccountForm.java

```java
package dev.dong4j.zeka.demo.account.entity.form;

import dev.dong4j.zeka.kernel.common.base.BaseForm;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/** 创建输入，长度约束与数据库字段保持一致。 */
@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(name = "AccountForm")
public class AccountForm extends BaseForm<Long> {
    @NotBlank
    @Size(max = 64)
    @Schema(description = "账户名称")
    private String accountName;
}
```

## account/entity/form/AccountQuery.java

```java
package dev.dong4j.zeka.demo.account.entity.form;

import dev.dong4j.zeka.kernel.common.base.BaseQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/** 查询条件；使用时由 Service 校验分页、排序并映射到白名单列。 */
@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(name = "AccountQuery")
public class AccountQuery extends BaseQuery<Long> {
    private String accountName;
}
```

Query 展示输入模型扩展方式；本最小范例只实现创建和详情，不会在未定义 SQL 和排序规则时自动开放通用查询接口。

## account/entity/dto/AccountDTO.java

```java
package dev.dong4j.zeka.demo.account.entity.dto;

import dev.dong4j.zeka.kernel.common.base.BaseDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/** 明确允许公开的返回字段，不把完整 PO 暴露给客户端。 */
@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(name = "AccountDTO")
public class AccountDTO extends BaseDTO<Long> {
    private String accountName;
}
```

## account/entity/converter/AccountConverter.java

```java
package dev.dong4j.zeka.demo.account.entity.converter;

import dev.dong4j.zeka.demo.account.entity.dto.AccountDTO;
import dev.dong4j.zeka.demo.account.entity.form.AccountForm;
import dev.dong4j.zeka.demo.account.entity.po.Account;
import dev.dong4j.zeka.kernel.common.mapstruct.ExtendConverter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

/** 转换边界集中维护，创建时不接受客户端指定主键。 */
@Mapper
public interface AccountConverter extends ExtendConverter<AccountForm, AccountDTO, Account> {
    AccountConverter INSTANCE = Mappers.getMapper(AccountConverter.class);

    /** 主键和审计字段由持久层策略生成。 */
    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createTime", ignore = true)
    @Mapping(target = "updateTime", ignore = true)
    Account f2p(AccountForm form);
}
```

## account/dao/AccountMapper.java

```java
package dev.dong4j.zeka.demo.account.dao;

import dev.dong4j.zeka.demo.account.entity.po.Account;
import dev.dong4j.zeka.starter.mybatis.base.BaseDao;
import org.apache.ibatis.annotations.Mapper;

/** 使用框架 DAO 复用 CRUD，本例没有自定义 SQL。 */
@Mapper
public interface AccountMapper extends BaseDao<Account> {
}
```

## account/service/AccountService.java

```java
package dev.dong4j.zeka.demo.account.service;

import dev.dong4j.zeka.demo.account.entity.dto.AccountDTO;
import dev.dong4j.zeka.demo.account.entity.form.AccountForm;
import dev.dong4j.zeka.demo.account.entity.po.Account;
import dev.dong4j.zeka.starter.mybatis.service.BaseService;

/** 账户业务边界，Controller 不直接操作 Mapper。 */
public interface AccountService extends BaseService<Account> {
    /** 返回经过转换的公开模型，缺失时抛统一业务异常。 */
    AccountDTO detail(Long id);

    /** 新增失败时抛异常，保证事务不会伪成功。 */
    void create(AccountForm form);
}
```

## account/service/impl/AccountServiceImpl.java

```java
package dev.dong4j.zeka.demo.account.service.impl;

import dev.dong4j.zeka.demo.account.dao.AccountMapper;
import dev.dong4j.zeka.demo.account.entity.converter.AccountConverter;
import dev.dong4j.zeka.demo.account.entity.dto.AccountDTO;
import dev.dong4j.zeka.demo.account.entity.form.AccountForm;
import dev.dong4j.zeka.demo.account.entity.po.Account;
import dev.dong4j.zeka.demo.account.service.AccountService;
import dev.dong4j.zeka.kernel.common.api.BaseCodes;
import dev.dong4j.zeka.starter.mybatis.service.impl.BaseServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 在 Service 统一管理业务约束、转换和事务。 */
@Service
public class AccountServiceImpl extends BaseServiceImpl<AccountMapper, Account>
        implements AccountService {
    /** 缺失数据交给框架异常处理器，避免返回含糊的 null。 */
    @Override
    public AccountDTO detail(Long id) {
        Account account = this.baseMapper.selectById(id);
        BaseCodes.DATA_ERROR.notNull(account);
        return AccountConverter.INSTANCE.p2d(account);
    }

    /** 普通新增不使用 insertIgnore，避免静默吞掉唯一约束冲突。 */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(AccountForm form) {
        Account account = AccountConverter.INSTANCE.f2p(form);
        BaseCodes.OPTION_FAILURE.isTrue(this.baseMapper.insert(account) == 1);
    }
}
```

## account/controller/AccountController.java

```java
package dev.dong4j.zeka.demo.account.controller;

import dev.dong4j.zeka.demo.account.entity.dto.AccountDTO;
import dev.dong4j.zeka.demo.account.entity.form.AccountForm;
import dev.dong4j.zeka.demo.account.service.AccountService;
import dev.dong4j.zeka.starter.rest.ServletController;
import dev.dong4j.zeka.starter.rest.annotation.RestControllerWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/** 仅处理协议与参数校验，结果由框架 Advice 自动包装。 */
@Tag(name = "账户接口")
@AllArgsConstructor
@RestControllerWrapper("/accounts")
public class AccountController extends ServletController {
    private final AccountService accountService;

    /** 对外返回 DTO，统一的不存在响应由 Service 的断言触发。 */
    @GetMapping("/{id}")
    @Operation(summary = "账户详情")
    public AccountDTO detail(@PathVariable Long id) {
        return this.accountService.detail(id);
    }

    /** 通过 Jakarta Validation 校验格式，在 Service 中处理业务和事务。 */
    @PostMapping
    @Operation(summary = "创建账户")
    public void create(@Validated @RequestBody AccountForm form) {
        this.accountService.create(form);
    }
}
```

## 集成验收

在业务项目实际配置的端口测试：合法创建成功，空名称/超长名称返回参数错误，存在账户的详情只返回允许字段，不存在账户返回统一错误，重复名称不伪成功。确认 `Result.code` 成功值为 2000、包前缀生效、时间字段填充与事务行为正确。补充授权后才能作为真实业务接口开放。
