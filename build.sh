#!/bin/bash

echo "========================================"
echo "  塔罗牌 Mystical - macOS/Linux 打包脚本"
echo "========================================"
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未安装 Node.js，请先安装！"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "[错误] 未安装 npm，请先安装！"
    exit 1
fi

echo "[1/4] 正在安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "[错误] 依赖安装失败！"
    exit 1
fi
echo "[完成] 依赖安装完成"

echo ""
echo "[2/4] 正在构建前端..."
npm run build
if [ $? -ne 0 ]; then
    echo "[错误] 前端构建失败！"
    exit 1
fi
echo "[完成] 前端构建完成"

echo ""
echo "[3/4] 正在打包 Electron 应用..."

# 检测系统并打包
if [[ "$OSTYPE" == "darwin"* ]]; then
    npx electron-builder --mac --dir --config electron-builder.json
    EXT="mac"
else
    npx electron-builder --linux --dir --config electron-builder.json
    EXT="linux-unpacked"
fi

if [ $? -ne 0 ]; then
    echo "[错误] Electron 打包失败！"
    exit 1
fi
echo "[完成] Electron 打包完成"

echo ""
echo "[4/4] 正在创建压缩包..."
cd release

if [[ "$OSTYPE" == "darwin"* ]]; then
    if [ -d "mac" ]; then
        zip -r "塔罗牌Mystical-v2.0.0-mac.zip" mac/
        echo "[完成] 压缩包创建完成: release/塔罗牌Mystical-v2.0.0-mac.zip"
    fi
else
    if [ -d "linux-unpacked" ]; then
        zip -r "塔罗牌Mystical-v2.0.0-linux.zip" linux-unpacked/
        echo "[完成] 压缩包创建完成: release/塔罗牌Mystical-v2.0.0-linux.zip"
    fi
fi

cd ..
echo ""
echo "========================================"
echo "  打包完成！"
echo "========================================"
echo "输出目录: release/"
echo "========================================"
