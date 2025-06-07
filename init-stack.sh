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
    echo '    <artifactId>$artifact_id</artifactId>'
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
  echo "✅ 所有项目克隆并处理完成。"
}

main