import type { Memory } from '@super/shared/types'
import type { MemoryStore, SearchOptions } from '../index'

interface SQLiteDatabase {
  run(sql: string, params?: unknown[]): Promise<void>
  get<T>(sql: string, params?: unknown[]): Promise<T | undefined>
  all<T>(sql: string, params?: unknown[]): Promise<T[]>
}

/**
 * SQLite 記憶儲存
 * 用於本地持久化儲存
 */
export class SQLiteMemoryStore implements MemoryStore {
  private db: SQLiteDatabase
  private initialized = false

  constructor(db: SQLiteDatabase) {
    this.db = db
  }

  async init(): Promise<void> {
    if (this.initialized) return

    await this.db.run(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        embedding TEXT,
        metadata TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    await this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_memories_agent_id ON memories(agent_id)
    `)

    await this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type)
    `)

    this.initialized = true
  }

  async add(memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memory> {
    await this.init()

    const id = crypto.randomUUID()
    const now = new Date()

    const newMemory: Memory = {
      id,
      ...memory,
      createdAt: now,
      updatedAt: now,
    }

    await this.db.run(
      `INSERT INTO memories (id, agent_id, type, content, embedding, metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        memory.agentId,
        memory.type,
        memory.content,
        memory.embedding ? JSON.stringify(memory.embedding) : null,
        memory.metadata ? JSON.stringify(memory.metadata) : null,
        now.toISOString(),
        now.toISOString(),
      ]
    )

    return newMemory
  }

  async get(id: string): Promise<Memory | null> {
    await this.init()

    const row = await this.db.get<MemoryRow>(
      'SELECT * FROM memories WHERE id = ?',
      [id]
    )

    return row ? this.rowToMemory(row) : null
  }

  async getByAgent(agentId: string): Promise<Memory[]> {
    await this.init()

    const rows = await this.db.all<MemoryRow>(
      'SELECT * FROM memories WHERE agent_id = ? ORDER BY created_at DESC',
      [agentId]
    )

    return rows.map(this.rowToMemory)
  }

  async search(query: string, options?: SearchOptions): Promise<Memory[]> {
    await this.init()

    // 基礎全文搜尋（SQLite FTS 或 LIKE）
    // 實際應用中應該用向量搜尋
    let sql = 'SELECT * FROM memories WHERE content LIKE ?'
    const params: unknown[] = [`%${query}%`]

    if (options?.agentId) {
      sql += ' AND agent_id = ?'
      params.push(options.agentId)
    }

    if (options?.type) {
      sql += ' AND type = ?'
      params.push(options.type)
    }

    sql += ' ORDER BY created_at DESC'

    if (options?.limit) {
      sql += ' LIMIT ?'
      params.push(options.limit)
    }

    const rows = await this.db.all<MemoryRow>(sql, params)
    return rows.map(this.rowToMemory)
  }

  async update(id: string, data: Partial<Memory>): Promise<Memory> {
    await this.init()

    const existing = await this.get(id)
    if (!existing) {
      throw new Error(`Memory not found: ${id}`)
    }

    const now = new Date()
    const updates: string[] = ['updated_at = ?']
    const params: unknown[] = [now.toISOString()]

    if (data.content !== undefined) {
      updates.push('content = ?')
      params.push(data.content)
    }

    if (data.type !== undefined) {
      updates.push('type = ?')
      params.push(data.type)
    }

    if (data.metadata !== undefined) {
      updates.push('metadata = ?')
      params.push(JSON.stringify(data.metadata))
    }

    if (data.embedding !== undefined) {
      updates.push('embedding = ?')
      params.push(JSON.stringify(data.embedding))
    }

    params.push(id)

    await this.db.run(
      `UPDATE memories SET ${updates.join(', ')} WHERE id = ?`,
      params
    )

    return {
      ...existing,
      ...data,
      updatedAt: now,
    }
  }

  async delete(id: string): Promise<void> {
    await this.init()
    await this.db.run('DELETE FROM memories WHERE id = ?', [id])
  }

  async clear(agentId: string): Promise<void> {
    await this.init()
    await this.db.run('DELETE FROM memories WHERE agent_id = ?', [agentId])
  }

  private rowToMemory(row: MemoryRow): Memory {
    return {
      id: row.id,
      agentId: row.agent_id,
      type: row.type as Memory['type'],
      content: row.content,
      embedding: row.embedding ? JSON.parse(row.embedding) : undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }
}

interface MemoryRow {
  id: string
  agent_id: string
  type: string
  content: string
  embedding: string | null
  metadata: string | null
  created_at: string
  updated_at: string
}
