#!/bin/bash

echo "🚀 启动 NestJS + SQLite + MinIO 项目"

# 检查是否存在 .env 文件
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cat > .env << EOF
# 数据库配置
SQLITE_DATABASE=database.sqlite

# MinIO 配置
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=nest-ali-ai

# JWT 配置
JWT_SECRET=your-jwt-secret-key-$(date +%s)
JWT_EXPIRES_IN=7d

# OpenAI 配置
OPENAI_API_KEY=your-openai-api-key

# 应用配置
NODE_ENV=development
PORT=3000
EOF
    echo "✅ .env 文件已创建，请根据需要修改配置"
fi

# # 安装依赖
# echo "📦 安装依赖..."
# pnpm install

# # 启动 Docker 服务
# echo "🐳 启动 Docker 服务..."
# docker-compose up -d

# # 等待服务启动
# echo "⏳ 等待服务启动..."
# sleep 10

# # 检查服务状态
# echo "🔍 检查服务状态..."
# docker-compose ps

# echo ""
# echo "🎉 服务启动完成！"
# echo "📱 应用服务: http://localhost:3000"
# echo "🖥️  MinIO 控制台: http://localhost:9001 (用户名: minioadmin, 密码: minioadmin)"
# echo "📊 MinIO API: http://localhost:9000"
# echo ""
# echo "📝 查看日志: docker-compose logs -f app"
# echo "🛑 停止服务: docker-compose down"
