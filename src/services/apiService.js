// API服务模块 - 支持多种AI模型
// 参考情绪盲盒项目的API架构
// 支持豆包Endpoint ID调用方式

class ApiService {
  constructor() {
    // 文本API端点
    this.textApiEndpoints = {
      doubao: 'https://ark.cn-beijing.volces.com/api/v3',
      deepseek: 'https://api.deepseek.com/v1/chat/completions',
      qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      bailian: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      kimi: 'https://api.moonshot.cn/v1/chat/completions',
      siliconflow: 'https://api.siliconflow.cn/v1/chat/completions',
      glm: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      ernie: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
      spark: 'https://spark-api-open.xf-yun.com/v1/chat/completions'
    }
    
    // 文本模型名称
    this.textModelNames = {
      doubao: 'doubao-seed-2-0-pro-260215',
      deepseek: 'deepseek-chat',
      qwen: 'qwen3.5-plus',
      bailian: 'qwen3.5-plus',
      kimi: 'kimi-k2.5',
      siliconflow: 'deepseek-ai/DeepSeek-V3',
      glm: 'glm-5',
      ernie: 'ernie-4.0-8k',
      spark: '4.0Ultra'
    }
  }
  
  // 调用文本AI - 塔罗解读
  async getTarotReading(cardsDescription, dimensionText, settings) {
    if (!settings.provider || settings.provider === 'none') {
      return null
    }
    
    const { provider, apiKey, model, authType, ak, sk, endpointId } = settings
    
    try {
      const systemPrompt = `你是一位专业的塔罗牌解读师，精通西方神秘学和心理学。请根据用户抽取的塔罗牌阵，给出专业、温暖、有启发性的解读。解读应当包含：每张牌的象征意义、牌阵中牌与牌的关联、对用户的建议和指引。请使用中文回答，语言要优美、有诗意。`
      
      const userMessage = `请解读以下塔罗牌阵：
${cardsDescription}

请从【${dimensionText}】维度进行解读。`
      
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
      
      let response
      switch (provider) {
        case 'doubao':
          response = await this.callDoubaoTextAPI(messages, apiKey, authType, ak, sk, model, endpointId)
          break
        case 'deepseek':
          response = await this.callDeepSeekTextAPI(messages, apiKey, model)
          break
        case 'qwen':
          response = await this.callQwenTextAPI(messages, apiKey, model)
          break
        case 'bailian':
          response = await this.callBailianTextAPI(messages, apiKey, model)
          break
        case 'kimi':
          response = await this.callKimiTextAPI(messages, apiKey, model)
          break
        case 'siliconflow':
          response = await this.callSiliconFlowTextAPI(messages, apiKey, model)
          break
        case 'glm':
          response = await this.callGLMTextAPI(messages, apiKey, model)
          break
        case 'ernie':
          response = await this.callErnieTextAPI(messages, apiKey, model)
          break
        case 'spark':
          response = await this.callSparkTextAPI(messages, apiKey, model)
          break
        default:
          return null
      }
      
      return this.extractTextContent(response, provider)
    } catch (error) {
      console.error('塔罗解读API调用失败:', error)
      throw error
    }
  }
  
  // 追问功能
  async chatWithAI(systemPrompt, userPrompt, conversationHistory, settings) {
    if (!settings.provider || settings.provider === 'none') {
      return null
    }
    
    const { provider, apiKey, model, authType, ak, sk, endpointId } = settings
    
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...(conversationHistory || []),
        { role: 'user', content: userPrompt }
      ]
      
      let response
      switch (provider) {
        case 'doubao':
          response = await this.callDoubaoTextAPI(messages, apiKey, authType, ak, sk, model, endpointId)
          break
        case 'deepseek':
          response = await this.callDeepSeekTextAPI(messages, apiKey, model)
          break
        case 'qwen':
          response = await this.callQwenTextAPI(messages, apiKey, model)
          break
        case 'bailian':
          response = await this.callBailianTextAPI(messages, apiKey, model)
          break
        case 'kimi':
          response = await this.callKimiTextAPI(messages, apiKey, model)
          break
        case 'siliconflow':
          response = await this.callSiliconFlowTextAPI(messages, apiKey, model)
          break
        case 'glm':
          response = await this.callGLMTextAPI(messages, apiKey, model)
          break
        case 'ernie':
          response = await this.callErnieTextAPI(messages, apiKey, model)
          break
        case 'spark':
          response = await this.callSparkTextAPI(messages, apiKey, model)
          break
        default:
          return null
      }
      
      return this.extractTextContent(response, provider)
    } catch (error) {
      console.error('AI对话失败:', error)
      throw error
    }
  }
  
  // ============== 文本API调用方法 ==============
  
  // 豆包文本API - 支持Model ID和Endpoint ID两种方式
  async callDoubaoTextAPI(messages, apiKey, authType, ak, sk, modelName, endpointId) {
    let endpoint
    let payload
    
    if (endpointId) {
      // Endpoint ID调用方式
      endpoint = `${this.textApiEndpoints.doubao}/endpoint/${endpointId}/chat/completions`
      payload = {
        messages: messages,
        max_completion_tokens: 2000,
        temperature: 0.8
      }
    } else {
      // Model ID调用方式
      endpoint = `${this.textApiEndpoints.doubao}/chat/completions`
      const model = modelName || this.textModelNames.doubao
      payload = {
        model: model,
        messages: messages,
        max_completion_tokens: 2000,
        temperature: 0.8
      }
    }
    
    let headers
    if (authType === 'ak_sk' && ak && sk) {
      headers = await this.getDoubaoHeadersWithSignature(payload, ak, sk, endpointId)
    } else {
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`豆包API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  // DeepSeek文本API
  async callDeepSeekTextAPI(messages, apiKey, modelName) {
    const endpoint = this.textApiEndpoints.deepseek
    const model = modelName || this.textModelNames.deepseek
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`DeepSeek API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  // 通义千问文本API
  async callQwenTextAPI(messages, apiKey, modelName) {
    const endpoint = this.textApiEndpoints.qwen
    const model = modelName || this.textModelNames.qwen
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`通义千问API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  // 百炼文本API（阿里云DashScope）
  async callBailianTextAPI(messages, apiKey, modelName) {
    const endpoint = this.textApiEndpoints.bailian
    const model = modelName || this.textModelNames.bailian
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`百炼API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  // Kimi文本API
  async callKimiTextAPI(messages, apiKey, modelName) {
    const endpoint = this.textApiEndpoints.kimi
    const model = modelName || this.textModelNames.kimi
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`Kimi API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  // 硅基流动文本API
  async callSiliconFlowTextAPI(messages, apiKey, modelName) {
    const endpoint = this.textApiEndpoints.siliconflow
    const model = modelName || this.textModelNames.siliconflow
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`硅基流动API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  // 智谱AI (GLM) 文本API
  async callGLMTextAPI(messages, apiKey, modelName) {
    const endpoint = this.textApiEndpoints.glm
    const model = modelName || this.textModelNames.glm
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`智谱AI API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  // 文心一言 (ERNIE) 文本API
  async callErnieTextAPI(messages, apiKey, modelName) {
    const endpoint = this.textApiEndpoints.ernie
    const model = modelName || this.textModelNames.ernie
    
    const payload = {
      model: model,
      messages: messages,
      max_output_tokens: 2000,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`文心一言API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  // 讯飞星火 (Spark) 文本API
  async callSparkTextAPI(messages, apiKey, modelName) {
    const endpoint = this.textApiEndpoints.spark
    const model = modelName || this.textModelNames.spark
    
    const payload = {
      model: model,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.8
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`讯飞星火API调用失败: ${response.status}`)
    }
    
    return await response.json()
  }
  
  // ============== 响应解析方法 ==============
  
  // 提取文本内容
  extractTextContent(response, apiType) {
    switch (apiType) {
      case 'doubao':
        if (response.Data && response.Data.output && response.Data.output.choices) {
          return response.Data.output.choices[0]?.message?.content || null
        } else if (response.choices) {
          return response.choices[0]?.message?.content || null
        }
        break
      case 'deepseek':
      case 'qwen':
      case 'bailian':
      case 'kimi':
      case 'siliconflow':
      case 'glm':
      case 'ernie':
      case 'spark':
        if (response.choices) {
          return response.choices[0]?.message?.content || null
        }
        break
    }
    return null
  }
  
  // 测试连接
  async testConnection(settings) {
    if (!settings.provider || settings.provider === 'none') {
      return { success: false, message: '请选择API类型' }
    }
    
    const { provider, apiKey, model, authType, ak, sk, endpointId } = settings
    
    try {
      const messages = [
        {
          role: 'user',
          content: '你好，请回复"连接成功"四个字。'
        }
      ]
      
      let response
      switch (provider) {
        case 'doubao':
          response = await this.callDoubaoTextAPI(messages, apiKey, authType, ak, sk, model, endpointId)
          break
        case 'deepseek':
          response = await this.callDeepSeekTextAPI(messages, apiKey, model)
          break
        case 'qwen':
          response = await this.callQwenTextAPI(messages, apiKey, model)
          break
        case 'bailian':
          response = await this.callBailianTextAPI(messages, apiKey, model)
          break
        case 'kimi':
          response = await this.callKimiTextAPI(messages, apiKey, model)
          break
        case 'siliconflow':
          response = await this.callSiliconFlowTextAPI(messages, apiKey, model)
          break
        case 'glm':
          response = await this.callGLMTextAPI(messages, apiKey, model)
          break
        case 'ernie':
          response = await this.callErnieTextAPI(messages, apiKey, model)
          break
        case 'spark':
          response = await this.callSparkTextAPI(messages, apiKey, model)
          break
        default:
          return { success: false, message: '不支持的API类型' }
      }
      
      const content = this.extractTextContent(response, provider)
      if (content) {
        return { success: true, message: `连接成功！API返回: "${content.substring(0, 20)}..."` }
      } else {
        return { success: false, message: 'API返回为空' }
      }
    } catch (error) {
      return { success: false, message: error.message || '连接失败' }
    }
  }
  
  // ============== 豆包AK/SK签名认证 ==============
  
  async getDoubaoHeadersWithSignature(payload, ak, sk, endpointId) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').substring(0, 17) + 'Z'
    const host = 'ark.cn-beijing.volces.com'
    let path
    
    if (endpointId) {
      path = `/api/v3/endpoint/${endpointId}/chat/completions`
    } else {
      path = '/api/v3/chat/completions'
    }
    
    const body = JSON.stringify(payload)
    const payloadHash = await this.sha256(body)
    
    const canonicalHeaders = `content-type:application/json; charset=utf-8
host:${host}
x-content-sha256:${payloadHash}
x-date:${timestamp}\n`
    const signedHeaders = 'content-type;host;x-content-sha256;x-date'
    
    const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`
    const canonicalRequestHash = await this.sha256(canonicalRequest)
    
    const credentialScope = `${timestamp.substring(0, 8)}/cn-beijing/ark/request`
    const stringToSign = `VC-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${canonicalRequestHash}`
    
    const signature = await this.hmacSha256(stringToSign, sk)
    const credential = `${ak}/${credentialScope}`
    const authHeader = `VC-HMAC-SHA256 Credential=${credential}, SignedHeaders=${signedHeaders}, Signature=${signature}`
    
    return {
      'Content-Type': 'application/json; charset=utf-8',
      'Host': host,
      'X-Date': timestamp,
      'X-Content-Sha256': payloadHash,
      'Authorization': authHeader
    }
  }
  
  sha256(str) {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    return crypto.subtle.digest('SHA-256', data).then(buffer => {
      return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
    })
  }
  
  hmacSha256(str, key) {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const keyData = encoder.encode(key)
    return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .then(importedKey => crypto.subtle.sign('HMAC', importedKey, data))
      .then(buffer => {
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
      })
  }
}

export const apiService = new ApiService()
