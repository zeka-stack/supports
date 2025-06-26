#!/bin/bash

# ✅ 检查 GitHub Token 是否存在
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ 错误: 请先设置环境变量 GITHUB_TOKEN（需要 repo 权限）"
  exit 1
fi

# ✅ 检查参数是否为空
if [ "$#" -eq 0 ]; then
  echo "用法: $0 repo1 [repo2 ...]"
  exit 1
fi

# ✅ 基础信息
ORG="zeka-stack"
GITIGNORE_TEMPLATE="Java"
LICENSE_TEMPLATE="mit"

# ✅ 遍历参数（每个仓库名）
for REPO_NAME in "$@"; do
  echo "🚀 正在创建仓库: $REPO_NAME"

  # 发送创建请求并获取响应内容和 HTTP 状态码
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://api.github.com/orgs/$ORG/repos" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -d @- <<EOF
{
  "name": "$REPO_NAME",
  "description": "Created by shell script",
  "private": false,
  "license_template": "$LICENSE_TEMPLATE",
  "gitignore_template": "$GITIGNORE_TEMPLATE",
  "auto_init": true
}
EOF
)

  # 分离响应体和 HTTP 状态码（兼容 macOS 和 Linux）
  STATUS=$(printf "%s" "$RESPONSE" | awk 'END{print}')
  BODY=$(printf "%s" "$RESPONSE" | sed '$d')

  # ✅ 处理响应
  if [ "$STATUS" == "201" ]; then
    URL=$(echo "$BODY" | grep '"html_url":' | cut -d '"' -f4)
    echo "✅ 创建成功: $REPO_NAME"
    echo "🔗 地址: $URL"
  elif [ "$STATUS" == "422" ]; then
    URL="https://github.com/$ORG/$REPO_NAME"
    echo "⚠️ 已存在仓库: $REPO_NAME"
    echo "🔗 地址: $URL"
  else
    echo "❌ 创建失败: $REPO_NAME (HTTP $STATUS)"
    echo "$BODY" | jq '.message, .errors // empty' 2>/dev/null || echo "$BODY"
  fi

  echo ""
done