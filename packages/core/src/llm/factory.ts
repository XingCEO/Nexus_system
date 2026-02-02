/**
 * LLM Provider Factory
 * 根據配置建立對應的 LLM Provider
 */

import type { LLMProvider, LLMProviderConfig } from './types'
import { OpenAIProvider } from './providers/openai'
import { AnthropicProvider } from './providers/anthropic'
import { LMStudioProvider } from './providers/lmstudio'
import { OllamaProvider } from './providers/ollama'

export function createLLMProvider(config: LLMProviderConfig): LLMProvider {
  switch (config.provider) {
    case 'openai':
      if (!config.apiKey) {
        throw new Error('OpenAI API key is required')
      }
      return new OpenAIProvider({
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        model: config.model,
      })

    case 'anthropic':
      if (!config.apiKey) {
        throw new Error('Anthropic API key is required')
      }
      return new AnthropicProvider({
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        model: config.model,
      })

    case 'lmstudio':
      return new LMStudioProvider({
        baseUrl: config.baseUrl || 'http://localhost:1234/v1',
        model: config.model,
      })

    case 'ollama':
      return new OllamaProvider({
        baseUrl: config.baseUrl || 'http://localhost:11434',
        model: config.model,
      })

    default:
      throw new Error(`Unknown provider: ${config.provider}`)
  }
}

/**
 * 自動偵測可用的 LLM Provider
 */
export async function detectAvailableProviders(): Promise<
  Array<{ provider: LLMProviderConfig['provider']; available: boolean; models?: string[] }>
> {
  const results: Array<{ provider: LLMProviderConfig['provider']; available: boolean; models?: string[] }> = []

  // 檢查 LM Studio
  try {
    const lmstudio = new LMStudioProvider()
    const available = await lmstudio.healthCheck()
    results.push({ provider: 'lmstudio', available })
  } catch {
    results.push({ provider: 'lmstudio', available: false })
  }

  // 檢查 Ollama
  try {
    const ollama = new OllamaProvider()
    const available = await ollama.healthCheck()
    const models = available ? await ollama.listModels() : undefined
    results.push({ provider: 'ollama', available, models })
  } catch {
    results.push({ provider: 'ollama', available: false })
  }

  // OpenAI 和 Anthropic 需要 API key，無法自動偵測
  results.push({ provider: 'openai', available: false })
  results.push({ provider: 'anthropic', available: false })

  return results
}
