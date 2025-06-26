#!/bin/bash

set -e

# 确保用 bash 执行（不能用 sh）
if [ -z "$BASH_VERSION" ]; then
  echo "❌ 本脚本必须使用 bash 执行。请使用以下命令："
  echo ""
  echo "   bash <(curl -fsSL https://raw.githubusercontent.com/zeka-stack/supports/main/scripts/init-stack.sh)"
  exit 1
fi

BASE_DIR="zeka.stack"
REPOS_FILE="repos.txt"
REPOS_URL="https://raw.githubusercontent.com/zeka-stack/supports/main/scripts/repos.txt"
MAVEN_TMP_DIR="/tmp/zeka-stack-maven-template"
MAVEN_FILES=(
  "mvnw"
  "mvnw.cmd"
  ".mvn/maven.config"
  ".mvn/jvm.config"
  ".mvn/zeka.stack.settings.xml"
  ".mvn/wrapper/maven-wrapper.properties"
  ".mvn/wrapper/MavenWrapperDownloader.java"
)
GROUP_ID="dev.dong4j"
VERSION="hello.world"

# 彩色输出
info()    { echo -e "\033[1;34m$*\033[0m"; }
success() { echo -e "\033[1;32m$*\033[0m"; }
warn()    { echo -e "\033[1;33m$*\033[0m"; }
error()   { echo -e "\033[1;31m$*\033[0m"; }

# 检查依赖
for cmd in git curl; do
  if ! command -v $cmd &>/dev/null; then
    error "❌ 依赖缺失: $cmd"
    exit 1
  fi
done

# 检查/下载 repos.txt
TMP_REPOS_FILE=""
if [ ! -f "$REPOS_FILE" ]; then
  info "📥 未检测到本地 $REPOS_FILE，自动下载..."
  curl -fsSL "$REPOS_URL" -o "$REPOS_FILE"
  TMP_REPOS_FILE="$REPOS_FILE"
fi

# 解析分组和仓库
declare -A GROUPS
group=""
while IFS= read -r line || [ -n "$line" ]; do
  line="${line%%#*}"
  line="$(echo "$line" | xargs)"
  [ -z "$line" ] && continue
  if [[ "$line" =~ ^\[(.*)\]$ ]]; then
    group="${BASH_REMATCH[1]}"
    continue
  fi
  GROUPS["$group"]+="$line "
done < "$REPOS_FILE"

mkdir -p "$BASE_DIR"
cd "$BASE_DIR"

# 下载 maven wrapper 模板
download_maven_template() {
  if [ -d "$MAVEN_TMP_DIR" ]; then
    success "✅ 已下载过 maven 模板，跳过重新下载"
    return
  fi
  info "⬇️  正在下载 maven 模板文件..."
  for file in "${MAVEN_FILES[@]}"; do
    dir="$(dirname "$file")"
    mkdir -p "$MAVEN_TMP_DIR/$dir"
    curl -fsSL "https://raw.githubusercontent.com/zeka-stack/supports/main/maven/$file" -o "$MAVEN_TMP_DIR/$file" || {
      error "❌ 下载失败: $file"
      exit 1
    }
  done
  success "✅ maven 模板文件下载完成"
}

# 复制 maven wrapper
copy_maven_template() {
  cp -r "$MAVEN_TMP_DIR"/. ./
  touch .maven-copied
}

# 生成聚合 pom.xml
generate_pom() {
  local subdir="$1"
  shift
  local repos=("$@")
  [ -z "$subdir" ] && return
  [ "${#repos[@]}" -le 1 ] && return
  local pom_path="./pom.xml"
  local artifact_id="$subdir"
  if [ -f "$pom_path" ]; then
    return
  fi
  info "📦 生成聚合 pom.xml: $pom_path"
  {
    echo '<?xml version="1.0" encoding="UTF-8"?>'
    echo '<project xmlns="http://maven.apache.org/POM/4.0.0"'
    echo '         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
    echo '         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">'
    echo '    <modelVersion>4.0.0</modelVersion>'
    echo ''
    echo "    <groupId>$GROUP_ID</groupId>"
    echo "    <artifactId>$artifact_id</artifactId>"
    echo "    <version>$VERSION</version>"
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
  download_maven_template
  copy_maven_template
}

# 克隆仓库
clone_repos() {
  local repos=("$@")
  for repo in "${repos[@]}"; do
    local repo_name
    repo_name=$(basename "$repo" .git)
    if [ -d "$repo_name" ]; then
      warn "⚠️  $repo_name 已存在，跳过克隆。"
    else
      info "⬇️  克隆仓库: $repo"
      git clone "$repo"
    fi
  done
}

# 构建分组
build() {
  local subdir="$1"
  shift
  local repos=("$@")
  if [ -n "$subdir" ]; then
    mkdir -p "$subdir"
    cd "$subdir"
    clone_repos "${repos[@]}"
    generate_pom "$subdir" "${repos[@]}"
    cd ..
  else
    clone_repos "${repos[@]}"
  fi
}

# 主流程
for group in "${!GROUPS[@]}"; do
  repos=(${GROUPS[$group]})
  build "$group" "${repos[@]}"
done

# 用完后如果是自动下载的，删除临时文件
if [ -n "$TMP_REPOS_FILE" ]; then
  rm -f "$TMP_REPOS_FILE"
fi

echo ""
success "✅ 所有项目克隆并处理完成。"
echo ""
info "🧩 所有聚合 pom.xml 中的 <module> 标签默认已被注释；如需启用模块构建，请手动取消对应注释。"
echo ""
info "💡 建议使用 IntelliJ IDEA 打开项目，并按照以下方式配置 Maven："
echo "   1. ✅ 使用 Maven 包装器（mvnw）构建项目；"
echo "   2. ✅ 勾选『使用 .mvn/maven.config 中的设置』（Use settings from .mvn/maven.config）；"
echo ""
info "📘 这样能确保统一版本、参数设置，避免使用本地全局 Maven 配置。"
echo ""
info "🧩 如需自动补全 .gitignore，可用 curl https://www.toptal.com/developers/gitignore/api/java,maven > .gitignore"
echo ""