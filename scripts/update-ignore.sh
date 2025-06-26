#!/bin/bash

# 用法: ./scripts/update-ignore.sh <target_dir1> [target_dir2 ...]

set -e

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_FILE="$SCRIPT_DIR/../.gitignore"

# 忽略这些目录
EXCLUDE_DIRS=(.git node_modules build dist out target .idea .vscode supports)

if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "❌ 模板文件 $TEMPLATE_FILE 不存在，请确认项目结构正确。"
  exit 1
fi

if [ "$#" -eq 0 ]; then
  echo "用法: $0 <target_dir1> [target_dir2 ...]"
  exit 1
fi

# 读取模板内容
TEMPLATE_CONTENT=$(<"$TEMPLATE_FILE")

for TARGET_DIR in "$@"; do
  echo "📁 扫描目录: $TARGET_DIR"

  # 构造排除目录参数
  FIND_CMD=(find "$TARGET_DIR")
  for EXCLUDED in "${EXCLUDE_DIRS[@]}"; do
    FIND_CMD+=(-path "*/$EXCLUDED" -prune -o)
  done
  FIND_CMD+=(-type f -name ".gitignore" -print)

  # 执行 find 命令并更新文件
  "${FIND_CMD[@]}" | while read -r TARGET_FILE; do
    echo "↪️ 更新 $TARGET_FILE"
    echo "$TEMPLATE_CONTENT" > "$TARGET_FILE"
  done
done

echo "✅ 所有 .gitignore 文件已更新完成。"