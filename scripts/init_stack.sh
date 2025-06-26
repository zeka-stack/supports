#!/bin/bash

set -e

BASE_DIR="zeka.stack"
REPOS_FILE="repos.txt"
REPOS_URL="https://raw.githubusercontent.com/zeka-stack/supports/main/scripts/repos.txt"
TMP_REPOS_FILE=""

# 检查本地是否有 repos.txt，没有则下载
if [ ! -f "$REPOS_FILE" ]; then
  echo "📥 未检测到本地 $REPOS_FILE，自动下载..."
  curl -fsSL "$REPOS_URL" -o "$REPOS_FILE"
  TMP_REPOS_FILE="$REPOS_FILE"
fi

# 解析分组和仓库
declare -A GROUPS
group=""
while IFS= read -r line || [ -n "$line" ]; do
  line="${line%%#*}" # 去除注释
  line="$(echo "$line" | xargs)" # 去除首尾空格
  [ -z "$line" ] && continue
  if [[ "$line" =~ ^\[(.*)\]$ ]]; then
    group="${BASH_REMATCH[1]}"
    continue
  fi
  GROUPS["$group"]+="$line "
done < "$REPOS_FILE"

mkdir -p "$BASE_DIR"
cd "$BASE_DIR"

for group in "${!GROUPS[@]}"; do
  repos=(${GROUPS[$group]})
  if [ -z "$group" ]; then
    # 无分组仓库
    for repo in "${repos[@]}"; do
      repo_name=$(basename "$repo" .git)
      if [ -d "$repo_name" ]; then
        echo "$repo_name 已存在，跳过克隆。"
      else
        git clone "$repo"
      fi
    done
  else
    mkdir -p "$group"
    cd "$group"
    for repo in "${repos[@]}"; do
      repo_name=$(basename "$repo" .git)
      if [ -d "$repo_name" ]; then
        echo "$repo_name 已存在，跳过克隆。"
      else
        git clone "$repo"
      fi
    done
    cd ..
  fi
done

# 用完后如果是自动下载的，删除临时文件
if [ -n "$TMP_REPOS_FILE" ]; then
  rm -f "$TMP_REPOS_FILE"
fi

echo ""
echo "✅ 所有项目克隆并处理完成。"
echo ""
echo "🧩 如需生成聚合 pom.xml，请手动运行 Go 版本或自行补充 shell 逻辑。"