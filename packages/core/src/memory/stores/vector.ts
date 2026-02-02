import type { Memory } from '@super/shared/types'
import type { MemoryStore, SearchOptions, EmbeddingProvider } from '../index'

interface VectorDBClient {
  upsert(collection: string, points: VectorPoint[]): Promise<void>
  search(collection: string, vector: number[], options?: VectorSearchOptions): Promise<VectorSearchResult[]>
  delete(collection: string, ids: string[]): Promise<void>
  deleteByFilter(collection: string, filter: Record<string, unknown>): Promise<void>
}

interface VectorPoint {
  id: string
  vector: number[]
  payload: Record<string, unknown>
}

interface VectorSearchOptions {
  limit?: number
  filter?: Record<string, unknown>
  scoreThreshold?: number
}

interface VectorSearchResult {
  id: string
  score: number
  payload: Record<string, unknown>
}

/**
 * 向量資料庫記憶儲存
 * 支援語意搜尋
 */
export class VectorMemoryStore implements MemoryStore {
  private client: VectorDBClient
  private embedding: EmbeddingProvider
  private collection: string

  constructor(
    client: VectorDBClient,
    embedding: EmbeddingProvider,
    collection = 'memories'
  ) {
    this.client = client
    this.embedding = embedding
    this.collection = collection
  }

  async add(memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memory> {
    const id = crypto.randomUUID()
    const now = new Date()

    // 生成嵌入向量
    const vector = await this.embedding.embed(memory.content)

    const newMemory: Memory = {
      id,
      ...memory,
      embedding: vector,
      createdAt: now,
      updatedAt: now,
    }

    await this.client.upsert(this.collection, [
      {
        id,
        vector,
        payload: {
          agentId: memory.agentId,
          type: memory.type,
          content: memory.content,
          metadata: memory.metadata,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      },
    ])

    return newMemory
  }

  async get(id: string): Promise<Memory | null> {
    // 向量資料庫通常不支援直接 ID 查詢
    // 這裡用搜尋 + 過濾實現
    const results = await this.client.search(this.collection, [], {
      filter: { id },
      limit: 1,
    })

    if (results.length === 0) return null
    return this.resultToMemory(results[0])
  }

  async getByAgent(agentId: string): Promise<Memory[]> {
    const results = await this.client.search(this.collection, [], {
      filter: { agentId },
      limit: 1000,
    })

    return results.map(this.resultToMemory)
  }

  async search(query: string, options?: SearchOptions): Promise<Memory[]> {
    const vector = await this.embedding.embed(query)

    const filter: Record<string, unknown> = {}
    if (options?.agentId) filter.agentId = options.agentId
    if (options?.type) filter.type = options.type

    const results = await this.client.search(this.collection, vector, {
      limit: options?.limit ?? 10,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      scoreThreshold: options?.threshold ?? 0.7,
    })

    return results.map(this.resultToMemory)
  }

  async update(id: string, data: Partial<Memory>): Promise<Memory> {
    const existing = await this.get(id)
    if (!existing) {
      throw new Error(`Memory not found: ${id}`)
    }

    const now = new Date()
    const updated = { ...existing, ...data, updatedAt: now }

    // 如果內容變更，重新生成嵌入
    let vector = existing.embedding
    if (data.content && data.content !== existing.content) {
      vector = await this.embedding.embed(data.content)
      updated.embedding = vector
    }

    await this.client.upsert(this.collection, [
      {
        id,
        vector: vector!,
        payload: {
          agentId: updated.agentId,
          type: updated.type,
          content: updated.content,
          metadata: updated.metadata,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: now.toISOString(),
        },
      },
    ])

    return updated
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(this.collection, [id])
  }

  async clear(agentId: string): Promise<void> {
    await this.client.deleteByFilter(this.collection, { agentId })
  }

  private resultToMemory(result: VectorSearchResult): Memory {
    const payload = result.payload
    return {
      id: result.id,
      agentId: payload.agentId as string,
      type: payload.type as Memory['type'],
      content: payload.content as string,
      metadata: payload.metadata as Record<string, unknown> | undefined,
      createdAt: new Date(payload.createdAt as string),
      updatedAt: new Date(payload.updatedAt as string),
    }
  }
}
