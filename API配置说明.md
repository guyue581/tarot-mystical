# 塔罗牌软件 - API配置指南

## 支持的API提供商

### 文本解读API（8种）

| 提供商 | 默认模型 | 获取地址 | 认证方式 |
|--------|---------|---------|---------|
| DeepSeek | deepseek-chat | https://platform.deepseek.com | API Key |
| 通义千问 | qwen-plus | https://dashscope.aliyuncs.com | API Key |
| 豆包 | doubao-pro-32k | https://console.volces.com | API Key / AK-SK签名 |
| Kimi | moonshot-v1-32k | https://platform.moonshot.cn | API Key |
| 硅基流动 | deepseek-ai/DeepSeek-V3 | https://cloud.siliconflow.cn | API Key |
| 智谱AI | glm-4 | https://open.bigmodel.cn | API Key |
| 文心一言 | ernie-4.0-8k | https://console.bce.baidu.com | API Key |
| 讯飞星火 | 4.0Ultra | https://console.xfyun.cn | API Key |

### 图像生成API（4种）

| 提供商 | 默认模型 | 说明 |
|--------|---------|------|
| Pollinations | 无 | 免费，无需API Key |
| 通义万相 | wanx-v1 | 需要阿里云API Key |
| 智谱CogView | cogview-3 | 需要智谱API Key |
| 豆包 | doubao-v1 | 需要豆包API Key |

## 配置步骤

### 1. 申请API Key

1. 选择您想要使用的API提供商
2. 访问对应的官网注册账号
3. 在控制台中创建API Key
4. 复制API Key备用

### 2. 在软件中配置

1. 进入「设置」页面
2. 选择「文本解读」服务商
3. 选择认证方式（豆包支持API Key或AK/SK签名）
4. 输入API Key（或AK/SK）
5. 选择模型
6. 点击「测试API连接」验证配置
7. 点击「保存设置」

### 3. 豆包AK/SK签名认证

如果您使用的是豆包API，可以选择更安全的AK/SK签名认证：

1. 选择「豆包」作为文本解读服务商
2. 选择「AK/SK签名」认证方式
3. 前往火山引擎控制台获取Access Key和Secret Key
4. 分别输入AK和SK
5. 测试连接并保存

## 注意事项

- API Key请妥善保管，不要泄露给他人
- 不同提供商的计费方式不同，请查看对应官网
- 建议先测试连接，确保配置正确后再使用
- 图像生成可以使用免费的Pollinations服务
- 如果某个API调用失败，可以切换到其他提供商

## 常见问题

**Q: 为什么API连接测试失败？**
A: 请检查：1) API Key是否正确 2) 网络连接是否正常 3) 模型名称是否正确

**Q: 豆包API Key和AK/SK有什么区别？**
A: API Key是简单的Bearer Token认证，AK/SK是更安全的签名认证，适合企业级使用

**Q: 可以同时配置多个API吗？**
A: 可以配置多个API，但每次只能使用一个。您可以在设置中随时切换

**Q: 图像生成必须配置API吗？**
A: 不是，可以选择免费的Pollinations服务，无需API Key