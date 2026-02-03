import { NextRequest } from 'next/server'
import {
  createLLMProvider,
  detectAvailableProviders,
  type LLMProviderConfig,
  type LLMMessage,
} from '@super/core'

interface ProviderStatus {
  provider: LLMProviderConfig['provider']
  available: boolean
  models?: string[]
}

// 從請求或環境變數讀取配置
async function getLLMConfig(requestedProvider?: string, requestedModel?: string): Promise<LLMProviderConfig> {
  // 如果用戶指定了 provider
  if (requestedProvider) {
    switch (requestedProvider) {
      case 'anthropic':
        if (process.env.ANTHROPIC_API_KEY) {
          return {
            provider: 'anthropic',
            apiKey: process.env.ANTHROPIC_API_KEY,
            model: requestedModel || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
          }
        }
        throw new Error('Anthropic API key not configured. Please set ANTHROPIC_API_KEY in environment variables.')

      case 'openai':
        if (process.env.OPENAI_API_KEY) {
          return {
            provider: 'openai',
            apiKey: process.env.OPENAI_API_KEY,
            model: requestedModel || process.env.OPENAI_MODEL || 'gpt-4o',
          }
        }
        throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in environment variables.')

      case 'lmstudio':
        return {
          provider: 'lmstudio',
          baseUrl: process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1',
          model: requestedModel || process.env.LMSTUDIO_MODEL || 'local-model',
        }

      case 'ollama':
        return {
          provider: 'ollama',
          baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
          model: requestedModel || process.env.OLLAMA_MODEL || 'llama3.2',
        }
    }
  }

  // 預設：優先使用 Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    }
  }

  // 其次使用 OpenAI
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
    }
  }

  // 自動偵測本機 LLM
  const available = await detectAvailableProviders()

  const lmstudio = available.find((p: ProviderStatus) => p.provider === 'lmstudio')
  if (lmstudio?.available) {
    return {
      provider: 'lmstudio',
      baseUrl: process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1',
      model: process.env.LMSTUDIO_MODEL || 'local-model',
    }
  }

  const ollama = available.find((p: ProviderStatus) => p.provider === 'ollama')
  if (ollama?.available) {
    return {
      provider: 'ollama',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: ollama.models?.[0] || process.env.OLLAMA_MODEL || 'llama3.2',
    }
  }

  throw new Error('No LLM provider available. Please configure ANTHROPIC_API_KEY or OPENAI_API_KEY, or start a local LLM server.')
}

export async function POST(req: NextRequest) {
  try {
    const { messages, stream = false, provider: requestedProvider, model: requestedModel } = await req.json()

    const config = await getLLMConfig(requestedProvider, requestedModel)

    // 檢查是否有可用的 provider
    if (config.provider === 'ollama' || config.provider === 'lmstudio') {
      const available = await detectAvailableProviders()
      const providerStatus = available.find((p: ProviderStatus) => p.provider === config.provider)

      if (!providerStatus?.available) {
        return Response.json(
          {
            error: 'NO_PROVIDER',
            message: `無法連接到 ${config.provider}。請確保服務正在運行，或設定 ANTHROPIC_API_KEY / OPENAI_API_KEY 環境變數。`,
            availableProviders: available,
          },
          { status: 503 }
        )
      }
    }

    const provider = createLLMProvider(config)

    // 轉換訊息格式
    const llmMessages: LLMMessage[] = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })
    )

    // Streaming 模式
    if (stream) {
      const encoder = new TextEncoder()

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of provider.stream(llmMessages)) {
              if (chunk.content) {
                const data = JSON.stringify({ content: chunk.content, done: chunk.done })
                controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              }
              if (chunk.done) {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              }
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
            )
          } finally {
            controller.close()
          }
        },
      })

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // 非 Streaming 模式
    const response = await provider.chat(llmMessages)

    return Response.json({
      content: response.content,
      model: response.model,
      usage: response.usage,
      provider: config.provider,
    })
  } catch (error) {
    console.error('Chat API error:', error)

    const message = error instanceof Error ? error.message : 'Internal server error'

    return Response.json(
      {
        error: 'CHAT_ERROR',
        message,
      },
      { status: 500 }
    )
  }
}

// 取得可用的 providers
export async function GET() {
  try {
    const providers = await detectAvailableProviders()

    // 檢查環境變數中的 API keys
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY

    return Response.json({
      providers: providers.map((p: ProviderStatus) => ({
        ...p,
        available:
          p.provider === 'anthropic'
            ? hasAnthropicKey
            : p.provider === 'openai'
              ? hasOpenAIKey
              : p.available,
      })),
      currentConfig: {
        provider: hasAnthropicKey
          ? 'anthropic'
          : hasOpenAIKey
            ? 'openai'
            : providers.find((p: ProviderStatus) => p.available)?.provider || 'none',
      },
    })
  } catch (error) {
    console.error('Provider detection error:', error)
    return Response.json({ providers: [], currentConfig: { provider: 'none' } })
  }
}
