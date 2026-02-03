/**
 * Google Gemini Provider
 * 支援 Gemini Pro, Gemini 1.5 Pro, Gemini 1.5 Flash 等
 */

import type { LLMProvider, LLMMessage, LLMOptions, LLMResponse, LLMStreamChunk } from '../types'

export interface GeminiConfig {
  apiKey: string
  baseUrl?: string
  model?: string
}

export class GeminiProvider implements LLMProvider {
  readonly name = 'gemini'
  readonly model: string
  private apiKey: string
  private baseUrl: string

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta'
    this.model = config.model || 'gemini-1.5-flash'
  }

  async chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    // 轉換訊息格式為 Gemini 格式
    const contents = this.convertMessages(messages)

    const response = await fetch(
      `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? 4096,
            topP: options?.topP,
            stopSequences: options?.stopSequences,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Gemini API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const candidate = data.candidates?.[0]
    const content = candidate?.content?.parts?.[0]?.text || ''

    return {
      content,
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount || 0,
            completionTokens: data.usageMetadata.candidatesTokenCount || 0,
            totalTokens: data.usageMetadata.totalTokenCount || 0,
          }
        : undefined,
      model: this.model,
      finishReason: candidate?.finishReason === 'STOP' ? 'stop' : candidate?.finishReason?.toLowerCase(),
    }
  }

  async *stream(messages: LLMMessage[], options?: LLMOptions): AsyncIterable<LLMStreamChunk> {
    const contents = this.convertMessages(messages)

    const response = await fetch(
      `${this.baseUrl}/models/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? 4096,
            topP: options?.topP,
            stopSequences: options?.stopSequences,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Gemini API error: ${response.status} - ${error.error?.message || 'Unknown error'}`)
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
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''

            if (text) {
              yield { content: text, done: false }
            }

            // 檢查是否完成
            if (parsed.candidates?.[0]?.finishReason) {
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
      const response = await fetch(
        `${this.baseUrl}/models?key=${this.apiKey}`,
        { method: 'GET' }
      )
      return response.ok
    } catch {
      return false
    }
  }

  private convertMessages(messages: LLMMessage[]): Array<{ role: string; parts: Array<{ text: string }> }> {
    // Gemini 使用 'user' 和 'model' 作為 role
    // system message 需要合併到第一個 user message
    const systemMessage = messages.find((m) => m.role === 'system')
    const chatMessages = messages.filter((m) => m.role !== 'system')

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []

    for (let i = 0; i < chatMessages.length; i++) {
      const msg = chatMessages[i]
      let text = msg.content

      // 將 system prompt 加到第一個 user message
      if (i === 0 && msg.role === 'user' && systemMessage) {
        text = `${systemMessage.content}\n\n${text}`
      }

      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text }],
      })
    }

    return contents
  }
}
