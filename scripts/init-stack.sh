#!/bin/bash

BASE_DIR="zeka.stack"

# 仓库列表
ARCO_REPOS=(
  "https://github.com/zeka-stack/arco-supreme.git"
  "https://github.com/zeka-stack/arco-builder.git"
  "https://github.com/zeka-stack/arco-processor.git"
  "https://github.com/zeka-stack/arco-maven-plugin.git"
)

BLEN_REPOS=(
  "https://github.com/zeka-stack/blen-toolkit.git"
)

CUBO_REPOS=(
  "https://github.com/zeka-stack/cubo-starter.git"
)

CUBO_STARTER_REPOS=(
  "https://github.com/zeka-stack/cubo-starter-examples.git"
)

DOMI_REPOS=(
  "https://github.com/zeka-stack/domi-gateway.git"
  "https://github.com/zeka-stack/domi-gateway-lite.git"
  "https://github.com/zeka-stack/domi-auth.git"
  "https://github.com/zeka-stack/domi-ums.git"
  "https://github.com/zeka-stack/domi-logcat.git"
  "https://github.com/zeka-stack/domi-uid.git"
  "https://github.com/zeka-stack/domi-channel.git"
)

EIKO_REPOS=(
  "https://github.com/zeka-stack/eiko-apm.git"
  "https://github.com/zeka-stack/eiko-jetcache.git"
  "https://github.com/zeka-stack/eiko-nacos.git"
  "https://github.com/zeka-stack/eiko-schedule.git"
  "https://github.com/zeka-stack/eiko-sentinel.git"
)

FELO_REPOS=(
  "https://github.com/zeka-stack/felo-mall.git"
  "https://github.com/zeka-stack/felo-pay.git"
)

# Maven 模板文件列表（可按需增减）
MAVEN_FILES=(
  "mvnw"
  "mvnw.cmd"
  ".mvn/maven.config"
  ".mvn/jvm.config"
  ".mvn/zeka.stack.settings.xml"
  ".mvn/wrapper/maven-wrapper.properties"
  ".mvn/wrapper/MavenWrapperDownloader.java"
)

# 下载缓存目录（脚本执行目录下）
MAVEN_TMP_DIR="/tmp/zeka-stack-maven-template"

# 创建并进入目录
create_and_enter_dir() {
  local dir="$1"
  mkdir -p "$dir" && cd "$dir" || { echo "无法创建或进入目录 $dir"; exit 1; }
}

# 克隆仓库
clone_repos() {
  local repos=("$@")
  for repo in "${repos[@]}"; do
    local repo_name
    repo_name=$(basename "$repo" .git)
    if [ -d "$repo_name" ]; then
      echo "$repo_name 已存在，跳过克隆。"
    else
      git clone "$repo"
    fi
  done
}

# 生成聚合 POM（仅目录中有多个模块时）
generate_pom() {
  local subdir="$1"
  shift
  local repos=("$@")

  [ -z "$subdir" ] && return
  [ "${#repos[@]}" -le 1 ] && return

  local pom_path="./pom.xml"
  local artifact_id="$subdir"

  {
    echo '<?xml version="1.0" encoding="UTF-8"?>'
    echo '<project xmlns="http://maven.apache.org/POM/4.0.0"'
    echo '         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
    echo '         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">'
    echo '    <modelVersion>4.0.0</modelVersion>'
    echo ''
    echo '    <groupId>dev.dong4j</groupId>'
    echo "    <artifactId>$artifact_id</artifactId>"
    echo '    <version>hello.world</version>'
    echo '    <packaging>pom</packaging>'
    echo ''
    echo '    <modules>'
    for repo in "${repos[@]}"; do
      local name
      name=$(basename "$repo" .git)
      echo "        <!-- <module>$name</module> -->"
    done
    echo '    </modules>'
    echo ''
    echo '    <properties>'
    echo '        <maven.install.skip>true</maven.install.skip>'
    echo '        <maven.deploy.skip>true</maven.deploy.skip>'
    echo '    </properties>'
    echo '</project>'
  } > "$pom_path"

  echo "生成聚合 pom.xml: $pom_path"

  # 下载 maven 模板（只执行一次）
  download_maven_template

  # 复制模板文件（不重复）
  if [ ! -f ".maven-copied" ]; then
    echo "➡️  正在复制 maven 模板到 $(pwd)"
    cp -r "$MAVEN_TMP_DIR"/. ./
    touch .maven-copied
  fi
}

# 下载 maven 模板文件到本地缓存目录
download_maven_template() {
  if [ -d "$MAVEN_TMP_DIR" ]; then
    echo "✅ 已下载过 maven 模板，跳过重新下载"
    return
  fi

  echo "⬇️  正在下载 maven 模板文件..."

  for file in "${MAVEN_FILES[@]}"; do
    local dir
    dir="$(dirname "$file")"
    mkdir -p "$MAVEN_TMP_DIR/$dir"
    curl -fsSL "https://raw.githubusercontent.com/zeka-stack/supports/main/maven/$file" -o "$MAVEN_TMP_DIR/$file" || {
      echo "❌ 下载失败: $file"
      exit 1
    }
  done

  echo "✅ maven 模板文件下载完成"
}

# 构建一个分组
build() {
  local subdir="$1"
  shift
  local repos=("$@")

  if [ -n "$subdir" ]; then
    mkdir -p "$subdir"
    cd "$subdir" || { echo "无法进入子目录 $subdir"; exit 1; }
    clone_repos "${repos[@]}"
    generate_pom "$subdir" "${repos[@]}"
    cd ..
  else
    clone_repos "${repos[@]}"
  fi
}

# 主流程
main() {
  create_and_enter_dir "$BASE_DIR"
  build "arco-meta" "${ARCO_REPOS[@]}"
  build "" "${BLEN_REPOS[@]}"
  build "" "${CUBO_REPOS[@]}"
  build "" "${CUBO_STARTER_REPOS[@]}"
  build "domi-suite" "${DOMI_REPOS[@]}"
  build "eiko-orch" "${EIKO_REPOS[@]}"
  build "felo-space" "${FELO_REPOS[@]}"

  echo ""
  echo "✅ 所有项目克隆并处理完成。"
  echo ""
  echo "🚀 请设置以下环境变量以配置 Maven 仓库："
  echo ""
  echo "# Maven 中央仓库配置"
  echo "export MVN_CENTRAL_USERNAME=username"
  echo "export MVN_CENTRAL_PASSWORD=password"
  echo ""
  echo "# Maven 私服配置"
  echo "export MVN_PRIVATE_USERNAME=username"
  echo "export MVN_PRIVATE_PASSWORD=password"
  echo "export MVN_PRIVATE_PUBLIC_URL=\"http://ip:port/repository/maven-public/\""
  echo "export MVN_PRIVATE_SNAPSHOTS_URL=\"http://ip:port/repository/maven-snapshots/\""
  echo "export MVN_PRIVATE_RELEASE_URL=\"http://ip:port/repository/maven-releases/\""
  echo ""
  echo "💡 可将上述内容写入 ~/.bashrc 或 ~/.zshrc 中以便永久生效。"
  echo ""
  echo "💡 建议使用 IntelliJ IDEA 打开项目，并按照以下方式配置 Maven："
  echo "   1. ✅ 使用 Maven 包装器（mvnw）构建项目；"
  echo "   2. ✅ 勾选『使用 .mvn/maven.config 中的设置』（Use settings from .mvn/maven.config）；"
  echo ""
  echo "📘 这样能确保统一版本、参数设置，避免使用本地全局 Maven 配置。"
  echo ""
  echo "🧩 所有聚合 pom.xml 中的 <module> 标签默认已被注释；"
  echo "   👉 如需启用模块构建，请手动取消对应注释。"
}

main