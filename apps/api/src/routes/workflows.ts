import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

// Schema 定義
const nodeSchema = z.object({
  id: z.string(),
  type: z.enum(['trigger', 'agent', 'tool', 'condition', 'loop', 'parallel', 'transform', 'output']),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.object({
    label: z.string(),
    description: z.string().optional(),
    config: z.record(z.unknown()),
  }),
})

const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  label: z.string().optional(),
})

const workflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  variables: z.record(z.unknown()).optional(),
})

// 模擬資料
const MOCK_WORKFLOWS = [
  {
    id: '1',
    name: '客服自動回覆',
    description: '自動分析客戶問題並生成回覆',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: '接收訊息', config: { triggerType: 'webhook' } } },
      { id: 'agent-1', type: 'agent', position: { x: 300, y: 100 }, data: { label: '分析問題', config: { model: 'claude-3-sonnet' } } },
      { id: 'output-1', type: 'output', position: { x: 500, y: 100 }, data: { label: '發送回覆', config: { outputName: 'reply' } } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'agent-1' },
      { id: 'e2', source: 'agent-1', target: 'output-1' },
    ],
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-02T10:00:00Z',
  },
  {
    id: '2',
    name: '每日摘要生成',
    description: '每天早上自動生成新聞摘要',
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: '定時觸發', config: { triggerType: 'scheduled' } } },
      { id: 'tool-1', type: 'tool', position: { x: 300, y: 100 }, data: { label: '抓取新聞', config: { toolName: 'puppeteer__scrape' } } },
      { id: 'agent-1', type: 'agent', position: { x: 500, y: 100 }, data: { label: '生成摘要', config: { model: 'claude-3-sonnet' } } },
      { id: 'output-1', type: 'output', position: { x: 700, y: 100 }, data: { label: '發送郵件', config: { outputName: 'email' } } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'tool-1' },
      { id: 'e2', source: 'tool-1', target: 'agent-1' },
      { id: 'e3', source: 'agent-1', target: 'output-1' },
    ],
    createdAt: '2025-02-01T12:00:00Z',
    updatedAt: '2025-02-02T08:00:00Z',
  },
]

// 取得所有工作流
app.get('/', (c) => {
  return c.json({ success: true, data: MOCK_WORKFLOWS })
})

// 取得單一工作流
app.get('/:id', (c) => {
  const id = c.req.param('id')
  const workflow = MOCK_WORKFLOWS.find((w) => w.id === id)

  if (!workflow) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Workflow not found' } }, 404)
  }

  return c.json({ success: true, data: workflow })
})

// 建立工作流
app.post('/', zValidator('json', workflowSchema), (c) => {
  const body = c.req.valid('json')

  const workflow = {
    id: crypto.randomUUID(),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return c.json({ success: true, data: workflow }, 201)
})

// 更新工作流
app.patch('/:id', zValidator('json', workflowSchema.partial()), (c) => {
  const id = c.req.param('id')
  const body = c.req.valid('json')

  const workflow = {
    id,
    ...body,
    updatedAt: new Date().toISOString(),
  }

  return c.json({ success: true, data: workflow })
})

// 刪除工作流
app.delete('/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ success: true, data: { id } })
})

// 執行工作流
app.post('/:id/execute', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()

  // TODO: 使用 WorkflowEngine 執行
  const execution = {
    id: crypto.randomUUID(),
    workflowId: id,
    status: 'completed',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    input: body.input || {},
    output: { result: 'Workflow executed successfully' },
  }

  return c.json({ success: true, data: execution })
})

// 取得執行歷史
app.get('/:id/executions', (c) => {
  const id = c.req.param('id')

  const executions = [
    {
      id: 'exec-1',
      workflowId: id,
      status: 'completed',
      startedAt: '2025-02-02T10:00:00Z',
      completedAt: '2025-02-02T10:00:05Z',
    },
    {
      id: 'exec-2',
      workflowId: id,
      status: 'failed',
      startedAt: '2025-02-02T09:00:00Z',
      completedAt: '2025-02-02T09:00:03Z',
      error: 'Agent timeout',
    },
  ]

  return c.json({ success: true, data: executions })
})

// 取得節點類型列表
app.get('/nodes/types', (c) => {
  const nodeTypes = [
    { type: 'trigger', label: '觸發器', icon: '⚡', category: 'trigger' },
    { type: 'agent', label: 'AI 代理', icon: '🤖', category: 'agent' },
    { type: 'tool', label: '工具', icon: '🔧', category: 'agent' },
    { type: 'condition', label: '條件', icon: '🔀', category: 'logic' },
    { type: 'loop', label: '迴圈', icon: '🔁', category: 'logic' },
    { type: 'parallel', label: '並行', icon: '⚡', category: 'logic' },
    { type: 'transform', label: '轉換', icon: '🔄', category: 'data' },
    { type: 'output', label: '輸出', icon: '📤', category: 'output' },
  ]

  return c.json({ success: true, data: nodeTypes })
})

export default app
