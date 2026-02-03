/**
 * LM Studio Provider
 * 支援本機 LM Studio (OpenAI 相容 API)
 * 預設運行在 http://localhost:1234
 */

import type { LLMProvider, LLMMessage, LLMOptions, LLMResponse, LLMStreamChunk } from '../types'

export interface LMStudioConfig {
  baseUrl?: string
  model?: string
}

export class LMStudioProvider implements LLMProvider {
  readonly name = 'lmstudio'
  readonly model: string
  private baseUrl: string

  constructor(config: LMStudioConfig = {}) {
    this.baseUrl = config.baseUrl || 'http://127.0.0.1:8045/v1'
    this.model = config.model || 'local-model'
  }

  async chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
        top_p: options?.topP,
        stop: options?.stopSequences,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`LM Studio API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const choice = data.choices[0]

    return {
      content: choice.message.content || '',
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
      model: data.model,
      finishReason: choice.finish_reason,
    }
  }

  async *stream(messages: LLMMessage[], options?: LLMOptions): AsyncIterable<LLMStreamChunk> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
        top_p: options?.topP,
        stop: options?.stopSequences,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`LM Studio API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          const data = trimmed.slice(6)
          if (data === '[DONE]') {
            yield { content: '', done: true }
            return
          }

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices[0]?.delta?.content || ''
            if (delta) {
              yield { content: delta, done: false }
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    yield { content: '', done: true }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`)
      return response.ok
    } catch {
      return false
    }
  }
}
