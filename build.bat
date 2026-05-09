@echo off
chcp 65001
echo ========================================
echo   塔罗牌 Mystical - Windows 打包脚本
echo ========================================
echo.

:: 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未安装 Node.js，请先安装！
    pause
    exit /b 1
)

:: 检查npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未安装 npm，请先安装！
    pause
    exit /b 1
)

echo [1/4] 正在安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败！
    pause
    exit /b 1
)
echo [完成] 依赖安装完成

echo.
echo [2/4] 正在构建前端...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 前端构建失败！
    pause
    exit /b 1
)
echo [完成] 前端构建完成

echo.
echo [3/4] 正在打包 Electron 应用...
call npx electron-builder --win --dir --config electron-builder.json
if %errorlevel% neq 0 (
    echo [错误] Electron 打包失败！
    pause
    exit /b 1
)
echo [完成] Electron 打包完成

echo.
echo [4/4] 正在创建压缩包...
cd release
for /d %%i in (win-unpacked) do (
    powershell -command "Compress-Archive -Path '%%i\*' -DestinationPath '塔罗牌Mystical-v2.0.0-win.zip' -Force"
)
cd ..
echo [完成] 压缩包创建完成

echo.
echo ========================================
echo   打包完成！
echo ========================================
echo 输出目录: release\win-unpacked
echo 压缩包: release\塔罗牌Mystical-v2.0.0-win.zip
echo ========================================

pause
