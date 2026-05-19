# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

1. **每次回答前后回答结束后都需要叫我:【dong4j】**
2. **我提出的需求必须先给出实现方案并征求确认，确认后才能修改代码**

## Project Overview

**zeka-stack-api** is a REST API service that provides backend support for IntelliJ IDEA plugins within the larger Zeka Stack ecosystem. It
serves as the API/Support layer, enabling plugins to submit feedback, query AI models, manage authentication, and handle statistics.

### Tech Stack

- Java 17 (Temurin JDK)
- Spring Boot 3.x via ZekaStarter (`cubo-framework-spring-boot-starter`)
- Maven for build management
- MySQL with MyBatis Plus (`cubo-ssm-spring-boot-starter`)
- Blen Kernel for code generation

### Project Context

This is part of the Zeka Stack monorepo architecture:

- **Parent Directory**: `supports/` - contains supporting tools and APIs
- **Sibling Projects**: `zeka-stack-webui/`, `icons/`, `scripts/`
- **Related Modules**: `arco-meta`, `blen-kernel`, `cubo-starter`, `domi-suite` (managed via parent POM)

The API integrates with GitHub Discussions/Issues as the backend storage for feedback, eliminating the need for a separate feedback
database.

## Build & Development Commands

### Maven Commands

```bash
# Build (skip code quality checks for faster builds)
mvn clean package -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true

# Build with tests
mvn clean package

# Run tests
mvn test

# Run specific test
mvn test -Dtest=ZekaStackApiApplicationTest

# Run the application
mvn spring-boot:run

# Generate code using Blen code generator
mvn test -Dtest=AutoGeneratorCodeTest
```

### Deployment

```bash
# Deploy to remote server (uses rsync + SSH to 'm2' server)
./deploy.sh
```

### Configuration Profiles

- Default: `application.yml`
- Environment-specific: `application-m2.yml` (for m2 server deployment)

## Architecture

### Package Structure

```
src/main/java/dev/dong4j/zeka/stack/api/
├── ZekaStackApiApplication.java    # Main Spring Boot application (extends ZekaStarter)
├── auth/                            # Authentication & authorization module
│   ├── client/                      # OAuth clients
│   ├── config/                      # Auth configuration
│   ├── controller/                  # Auth REST controllers
│   ├── dao/                         # Data access layer
│   ├── entity/                      # Domain entities (dto, form, po)
│   ├── security/                    # Security components
│   └── service/                     # Business logic
├── manager/                         # Integration layer
│   └── github/                      # GitHub API integration
│       ├── client/                  # GitHub GraphQL client
│       ├── config/                  # GitHub configuration
│       ├── issues/                  # Issue management
│       └── webhook/                 # Webhook handling
├── plugin/                          # Plugin-specific features
│   ├── feedback/                    # Feedback submission to GitHub
│   ├── model/                       # AI model information
│   └── statistics/                  # Usage statistics tracking
└── project/                         # Project management features
    ├── controller/
    ├── dao/
    ├── entity/
    └── service/
```

### Layered Architecture Pattern

The codebase follows a strict layered architecture:

- **Controller** → **Service** → **DAO** → **Entity**
- **Manager** pattern for external API integration (GitHub integration lives here)

### Domain Modules

1. **auth/** - GitHub OAuth integration, user account/session management, device tracking
2. **plugin/feedback/** - Submit plugin feedback as GitHub Discussions/Issues with HMAC-SHA256 signature verification
3. **plugin/model/** - Query AI service provider model lists (e.g., Zhipu AI)
4. **plugin/statistics/** - Event tracking and analytics with 30-minute aggregation
5. **project/** - Project feature feedback management

## API Endpoints

### Base Configuration

- Context Path: `/api`
- Port: 8080
- Health Check: `GET /api/health`

### Main Endpoints

- `POST /api/plugin/feedback/discussion` - Submit feedback as GitHub Discussion
- `POST /api/plugin/feedback/issue` - Submit feedback as GitHub Issue
- `GET /api/plugin/v1/models/{provider}` - Get AI model list (e.g., `zhipu`)
- `POST /api/auth/login` - User login
- `GET /api/auth/status` - Check auth status
- `POST /api/oauth/github` - GitHub OAuth flow
- `POST /api/plugin/events` - Submit usage events
- `GET /api/plugin/statistics/{eventId}` - Get event statistics

## Security: HMAC Signature Verification

The feedback API implements HMAC-SHA256 request signing for plugin-to-API communication.

### Required Headers

- `X-Client-Id`: Plugin identifier (e.g., `dev.dong4j.zeka.stack.idea.plugin`)
- `X-Timestamp`: Unix timestamp in seconds (±300 seconds tolerance)
- `X-Nonce`: Unique random string (UUID, 5-minute expiration for replay protection)
- `X-Body-SHA256`: SHA256 hash of request body
- `X-Signature`: Base64-encoded HMAC-SHA256 signature

### Supported Plugins (Client IDs)

- `dev.dong4j.zeka.stack.idea.plugin` (Javadoc plugin)
- `dev.dong4j.zeka.stack.idea.plugin.nacos` (Nacos plugin)
- `dev.dong4j.zeka.stack.idea.plugin.workflow` (Tracer plugin)
- `dev.dong4j.zeka.stack.idea.plugin.changelog` (Changelog plugin)
- `dev.dong4j.zeka.stack.idea.plugin.common.ai` (Engine plugin)
- `zeka-stack-webui` (Web UI)

### Signature Algorithm

```
canonicalString = METHOD + "\n" + PATH_WITH_QUERY + "\n" + BODY_SHA256_HEX + "\n" + TIMESTAMP + "\n" + NONCE
signature = Base64(HMAC_SHA256(secret, canonicalString))
```

See `docs/HMAC签名验证说明.md` for full implementation details.

## Configuration

### Application Configuration (`application.yml`)

Key configuration sections:

- **Database**: MySQL connection to `zeka-stack-helper` database
- **GitHub**: Token, repository ID, category IDs for Discussions
- **Zhipu AI**: API base URL and default model list
- **OAuth**: GitHub OAuth client credentials and redirect URIs

### Environment Variables

- `ZEKA_STACK_PLUGIN_GITHUB_TOKEN` - GitHub personal access token
- `GITHUB_REPOSITORY_ID` - Repository global ID
- `GITHUB_CATEGORY_ID_*` - Discussion category IDs (general, ideas, qa, announcements)
- `ZEKA_STACK_GITHUB_CLIENT_ID` - GitHub OAuth app client ID
- `ZEKA_STACK_GITHUB_CLIENT_SECRET` - GitHub OAuth app client secret
- `FEEDBACK_SIGNATURE_ENABLED` - Enable/disable signature verification (default: true)

## Dependencies

### Parent POM

- `arco-business-parent:3.0.0-SNAPSHOT`
- Managed by `cubo-boot-dependencies`

### Key Dependencies

- `cubo-framework-spring-boot-starter` - Custom framework
- `cubo-ssm-spring-boot-starter` - SSM (Spring + SpringMVC + MyBatis)
- `blen-kernel-generator` - Code generation
- `mysql-connector-j` - MySQL JDBC driver (runtime)

## Code Generation

The project uses Blen Kernel's code generator (`AutoGeneratorCodeBuilder`) to generate CRUD code from database tables:

```bash
mvn test -Dtest=AutoGeneratorCodeTest
```

Generated templates include: DAO, SERVICE, ENUM, IMPL, ENTITY, DTO, QUERY, CONVERTER, XML, CONTROLLER.

## Documentation

Located in `docs/`:

- `API使用示例.md` - API usage examples with curl and Java
- `HMAC签名验证说明.md` - HMAC signature verification guide
- `用户身份识别方案.md` - User identity recognition approach
- `GitHub Discussions API 参数整理.md` - GitHub Discussions API parameters

Root-level docs:

- `model-api.md` - Model API overview
- `feedback-api.md` - Feedback API documentation
