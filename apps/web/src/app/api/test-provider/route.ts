import { NextRequest } from 'next/server'

// 測試 API Key 連線
export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey } = await req.json()

    if (!provider || !apiKey) {
      return Response.json({ success: false, error: '缺少必要參數' }, { status: 400 })
    }

    let testResult = { success: false, error: '', model: '' }

    switch (provider) {
      case 'openai': {
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            const models = data.data?.slice(0, 3).map((m: { id: string }) => m.id).join(', ') || 'GPT models'
            testResult = { success: true, error: '', model: models }
          } else {
            const error = await response.json().catch(() => ({}))
            testResult = {
              success: false,
              error: error.error?.message || `API 錯誤: ${response.status}`,
              model: ''
            }
          }
        } catch (e) {
          testResult = { success: false, error: '無法連接到 OpenAI API', model: '' }
        }
        break
      }

      case 'anthropic': {
        try {
          // Anthropic 沒有專門的測試端點，發送一個最小請求
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 1,
              messages: [{ role: 'user', content: 'hi' }],
            }),
          })

          if (response.ok) {
            testResult = { success: true, error: '', model: 'Claude Sonnet 4' }
          } else {
            const error = await response.json().catch(() => ({}))
            // 401 = invalid key, 其他可能是配額問題但 key 有效
            if (response.status === 401) {
              testResult = { success: false, error: 'API Key 無效', model: '' }
            } else if (response.status === 400) {
              // 400 通常表示 key 有效但請求格式問題，這裡我們認為連線成功
              testResult = { success: true, error: '', model: 'Claude models' }
            } else {
              testResult = {
                success: false,
                error: error.error?.message || `API 錯誤: ${response.status}`,
                model: ''
              }
            }
          }
        } catch (e) {
          testResult = { success: false, error: '無法連接到 Anthropic API', model: '' }
        }
        break
      }

      case 'gemini': {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
            { method: 'GET' }
          )

          if (response.ok) {
            const data = await response.json()
            const models = data.models?.slice(0, 3).map((m: { name: string }) => m.name.split('/').pop()).join(', ') || 'Gemini models'
            testResult = { success: true, error: '', model: models }
          } else {
            const error = await response.json().catch(() => ({}))
            testResult = {
              success: false,
              error: error.error?.message || `API 錯誤: ${response.status}`,
              model: ''
            }
          }
        } catch (e) {
          testResult = { success: false, error: '無法連接到 Google AI API', model: '' }
        }
        break
      }

      case 'lmstudio': {
        try {
          const baseUrl = apiKey || 'http://127.0.0.1:8045/v1'
          const response = await fetch(`${baseUrl}/models`, {
            signal: AbortSignal.timeout(5000),
          })

          if (response.ok) {
            const data = await response.json()
            const modelName = data.data?.[0]?.id || 'Local model'
            testResult = { success: true, error: '', model: modelName }
          } else {
            testResult = { success: false, error: '伺服器回應錯誤', model: '' }
          }
        } catch (e) {
          testResult = { success: false, error: 'LM Studio 未運行或無法連接', model: '' }
        }
        break
      }

      case 'ollama': {
        try {
          const baseUrl = apiKey || 'http://localhost:11434'
          const response = await fetch(`${baseUrl}/api/tags`, {
            signal: AbortSignal.timeout(5000),
          })

          if (response.ok) {
            const data = await response.json()
            const models = data.models?.map((m: { name: string }) => m.name).slice(0, 3).join(', ') || 'Ollama models'
            testResult = { success: true, error: '', model: models }
          } else {
            testResult = { success: false, error: '伺服器回應錯誤', model: '' }
          }
        } catch (e) {
          testResult = { success: false, error: 'Ollama 未運行或無法連接', model: '' }
        }
        break
      }

      default:
        testResult = { success: false, error: '不支援的 Provider', model: '' }
    }

    return Response.json(testResult)
  } catch (error) {
    console.error('Test provider error:', error)
    return Response.json(
      { success: false, error: '測試過程發生錯誤' },
      { status: 500 }
    )
  }
}
