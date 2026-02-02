/**
 * Anthropic Claude Provider
 * 支援 Claude 3.5 Sonnet, Claude 3 Opus 等
 */

import type { LLMProvider, LLMMessage, LLMOptions, LLMResponse, LLMStreamChunk } from '../types'

export interface AnthropicConfig {
  apiKey: string
  baseUrl?: string
  model?: string
}

export class AnthropicProvider implements LLMProvider {
  readonly name = 'anthropic'
  readonly model: string
  private apiKey: string
  private baseUrl: string

  constructor(config: AnthropicConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com'
    this.model = config.model || 'claude-sonnet-4-20250514'
  }

  async chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    // 分離 system message
    const systemMessage = messages.find((m) => m.role === 'system')
    const chatMessages = messages.filter((m) => m.role !== 'system')

    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: this.model,
        max_tokens: options?.maxTokens ?? 4096,
        system: systemMessage?.content,
        messages: chatMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: options?.temperature ?? 0.7,
        top_p: options?.topP,
        stop_sequences: options?.stopSequences,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Anthropic API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()

    return {
      content: data.content[0]?.text || '',
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens,
          }
        : undefined,
      model: data.model,
      finishReason: data.stop_reason === 'end_turn' ? 'stop' : data.stop_reason,
    }
  }

  async *stream(messages: LLMMessage[], options?: LLMOptions): AsyncIterable<LLMStreamChunk> {
    const systemMessage = messages.find((m) => m.role === 'system')
    const chatMessages = messages.filter((m) => m.role !== 'system')

    const response = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: this.model,
        max_tokens: options?.maxTokens ?? 4096,
        system: systemMessage?.content,
        messages: chatMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: options?.temperature ?? 0.7,
        top_p: options?.topP,
        stop_sequences: options?.stopSequences,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Anthropic API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
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

          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'content_block_delta') {
              const delta = parsed.delta?.text || ''
              if (delta) {
                yield { content: delta, done: false }
              }
            } else if (parsed.type === 'message_stop') {
              yield { content: '', done: true }
              return
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
      // Anthropic 沒有專門的 health endpoint，用簡單請求測試
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'hi' }],
        }),
      })
      return response.ok
    } catch {
      return false
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
    }
  }
}
