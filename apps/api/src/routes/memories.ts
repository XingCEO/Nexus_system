import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

// 記憶 Schema
const createMemorySchema = z.object({
  agentId: z.string().uuid(),
  type: z.enum(['fact', 'preference', 'experience', 'relationship']),
  content: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
})

const updateMemorySchema = z.object({
  type: z.enum(['fact', 'preference', 'experience', 'relationship']).optional(),
  content: z.string().min(1).optional(),
  metadata: z.record(z.unknown()).optional(),
})

// 取得所有記憶
app.get('/', async (c) => {
  const agentId = c.req.query('agentId')

  // TODO: 從實際的 MemoryStore 取得
  const memories = [
    {
      id: '1',
      agentId: agentId || 'default',
      type: 'fact',
      content: '用戶是一名軟體工程師',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  return c.json({ success: true, data: memories })
})

// 搜尋記憶
app.get('/search', async (c) => {
  const query = c.req.query('q')
  const agentId = c.req.query('agentId')
  const limit = parseInt(c.req.query('limit') || '10')

  // TODO: 實作語意搜尋
  return c.json({ success: true, data: [] })
})

// 取得單一記憶
app.get('/:id', async (c) => {
  const id = c.req.param('id')

  // TODO: 從實際的 MemoryStore 取得
  return c.json({
    success: true,
    data: {
      id,
      agentId: 'default',
      type: 'fact',
      content: '範例記憶',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  })
})

// 新增記憶
app.post('/', zValidator('json', createMemorySchema), async (c) => {
  const body = c.req.valid('json')

  // TODO: 儲存到實際的 MemoryStore
  const memory = {
    id: crypto.randomUUID(),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return c.json({ success: true, data: memory }, 201)
})

// 更新記憶
app.patch('/:id', zValidator('json', updateMemorySchema), async (c) => {
  const id = c.req.param('id')
  const body = c.req.valid('json')

  // TODO: 更新實際的 MemoryStore
  const memory = {
    id,
    agentId: 'default',
    ...body,
    updatedAt: new Date().toISOString(),
  }

  return c.json({ success: true, data: memory })
})

// 刪除記憶
app.delete('/:id', async (c) => {
  const id = c.req.param('id')

  // TODO: 從實際的 MemoryStore 刪除
  return c.json({ success: true, data: { id } })
})

// 清除所有記憶
app.delete('/clear/:agentId', async (c) => {
  const agentId = c.req.param('agentId')

  // TODO: 清除實際的 MemoryStore
  return c.json({ success: true, data: { agentId } })
})

export default app
