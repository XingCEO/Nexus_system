import type { Memory } from '@super/shared/types'

/**
 * 記憶儲存介面
 */
export interface MemoryStore {
  add(memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memory>
  get(id: string): Promise<Memory | null>
  getByAgent(agentId: string): Promise<Memory[]>
  search(query: string, options?: SearchOptions): Promise<Memory[]>
  update(id: string, data: Partial<Memory>): Promise<Memory>
  delete(id: string): Promise<void>
  clear(agentId: string): Promise<void>
}

export interface SearchOptions {
  agentId?: string
  type?: Memory['type']
  limit?: number
  threshold?: number
}

/**
 * 向量嵌入介面
 */
export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
  dimension: number
}

/**
 * 記憶提取器介面
 */
export interface MemoryExtractor {
  extract(conversation: ConversationContext): Promise<ExtractedMemory[]>
}

export interface ConversationContext {
  messages: Array<{ role: string; content: string }>
  agentId: string
}

export interface ExtractedMemory {
  type: Memory['type']
  content: string
  confidence: number
  metadata?: Record<string, unknown>
}

export { MemoryManager } from './manager'
export { SQLiteMemoryStore } from './stores/sqlite'
export { VectorMemoryStore } from './stores/vector'
export { LLMMemoryExtractor } from './extractors/llm'
