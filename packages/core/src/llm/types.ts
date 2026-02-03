/**
 * LLM Provider 類型定義
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMOptions {
  temperature?: number
  maxTokens?: number
  topP?: number
  stopSequences?: string[]
}

export interface LLMResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model?: string
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter'
}

export interface LLMStreamChunk {
  content: string
  done: boolean
}

export interface LLMProvider {
  readonly name: string
  readonly model: string

  /**
   * 發送聊天請求
   */
  chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse>

  /**
   * 串流聊天請求
   */
  stream(messages: LLMMessage[], options?: LLMOptions): AsyncIterable<LLMStreamChunk>

  /**
   * 檢查連線是否正常
   */
  healthCheck(): Promise<boolean>
}

export interface LLMProviderConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'lmstudio' | 'ollama'
  apiKey?: string
  baseUrl?: string
  model: string
  defaultOptions?: LLMOptions
}

export const DEFAULT_MODELS = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  gemini: 'gemini-1.5-flash',
  lmstudio: 'local-model',
  ollama: 'llama3.2',
} as const
