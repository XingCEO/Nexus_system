import type { Memory } from '@super/shared/types'
import type { MemoryStore, SearchOptions, MemoryExtractor, ConversationContext } from './index'

export interface MemoryManagerConfig {
  store: MemoryStore
  extractor?: MemoryExtractor
  autoExtract?: boolean
}

/**
 * 記憶管理器
 * 負責記憶的存取、搜尋和自動提取
 */
export class MemoryManager {
  private store: MemoryStore
  private extractor?: MemoryExtractor
  private autoExtract: boolean

  constructor(config: MemoryManagerConfig) {
    this.store = config.store
    this.extractor = config.extractor
    this.autoExtract = config.autoExtract ?? true
  }

  /**
   * 手動記住一條資訊
   */
  async remember(
    agentId: string,
    content: string,
    type: Memory['type'] = 'fact',
    metadata?: Record<string, unknown>
  ): Promise<Memory> {
    return this.store.add({
      agentId,
      type,
      content,
      metadata,
    })
  }

  /**
   * 根據語意搜尋相關記憶
   */
  async recall(
    query: string,
    options?: SearchOptions
  ): Promise<Memory[]> {
    return this.store.search(query, options)
  }

  /**
   * 取得特定 Agent 的所有記憶
   */
  async getAll(agentId: string): Promise<Memory[]> {
    return this.store.getByAgent(agentId)
  }

  /**
   * 取得特定記憶
   */
  async get(id: string): Promise<Memory | null> {
    return this.store.get(id)
  }

  /**
   * 更新記憶
   */
  async update(id: string, data: Partial<Memory>): Promise<Memory> {
    return this.store.update(id, data)
  }

  /**
   * 刪除記憶
   */
  async forget(id: string): Promise<void> {
    return this.store.delete(id)
  }

  /**
   * 清除 Agent 所有記憶
   */
  async clearAll(agentId: string): Promise<void> {
    return this.store.clear(agentId)
  }

  /**
   * 從對話中自動提取記憶
   */
  async extractFromConversation(context: ConversationContext): Promise<Memory[]> {
    if (!this.extractor) {
      return []
    }

    const extracted = await this.extractor.extract(context)
    const memories: Memory[] = []

    for (const item of extracted) {
      if (item.confidence >= 0.7) {
        const memory = await this.store.add({
          agentId: context.agentId,
          type: item.type,
          content: item.content,
          metadata: {
            ...item.metadata,
            confidence: item.confidence,
            extractedAt: new Date().toISOString(),
          },
        })
        memories.push(memory)
      }
    }

    return memories
  }

  /**
   * 生成記憶上下文（用於注入 System Prompt）
   */
  async buildContext(agentId: string, query?: string): Promise<string> {
    let memories: Memory[]

    if (query) {
      memories = await this.recall(query, { agentId, limit: 10 })
    } else {
      memories = await this.getAll(agentId)
    }

    if (memories.length === 0) {
      return ''
    }

    const grouped = {
      fact: memories.filter((m) => m.type === 'fact'),
      preference: memories.filter((m) => m.type === 'preference'),
      experience: memories.filter((m) => m.type === 'experience'),
      relationship: memories.filter((m) => m.type === 'relationship'),
    }

    let context = '## 關於用戶的記憶\n\n'

    if (grouped.fact.length > 0) {
      context += '### 事實\n'
      context += grouped.fact.map((m) => `- ${m.content}`).join('\n')
      context += '\n\n'
    }

    if (grouped.preference.length > 0) {
      context += '### 偏好\n'
      context += grouped.preference.map((m) => `- ${m.content}`).join('\n')
      context += '\n\n'
    }

    if (grouped.experience.length > 0) {
      context += '### 過往經驗\n'
      context += grouped.experience.map((m) => `- ${m.content}`).join('\n')
      context += '\n\n'
    }

    if (grouped.relationship.length > 0) {
      context += '### 關係\n'
      context += grouped.relationship.map((m) => `- ${m.content}`).join('\n')
      context += '\n\n'
    }

    return context
  }
}
