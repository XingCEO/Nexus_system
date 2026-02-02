import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

// MCP Server 配置 Schema
const serverConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  command: z.string().min(1),
  args: z.array(z.string()).optional(),
  env: z.record(z.string()).optional(),
  enabled: z.boolean().default(true),
})

// 預設 MCP Servers（市場）
const MARKETPLACE_SERVERS = [
  {
    id: 'filesystem',
    name: 'Filesystem',
    description: '讀寫本地檔案系統',
    author: 'Anthropic',
    category: 'system',
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-filesystem'],
    stars: 12500,
    installed: false,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub 操作（PR、Issue、Repo）',
    author: 'Anthropic',
    category: 'dev',
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-github'],
    stars: 8900,
    installed: false,
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description: '瀏覽器自動化與截圖',
    author: 'Anthropic',
    category: 'automation',
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-puppeteer'],
    stars: 6200,
    installed: false,
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'PostgreSQL 資料庫操作',
    author: 'Anthropic',
    category: 'database',
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-postgres'],
    stars: 5800,
    installed: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Slack 訊息與頻道操作',
    author: 'Community',
    category: 'communication',
    command: 'npx',
    args: ['-y', '@mcp/slack-server'],
    stars: 3200,
    installed: false,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Notion 頁面與資料庫操作',
    author: 'Community',
    category: 'productivity',
    command: 'npx',
    args: ['-y', '@mcp/notion-server'],
    stars: 4100,
    installed: false,
  },
]

// 取得市場列表
app.get('/marketplace', (c) => {
  const category = c.req.query('category')
  const search = c.req.query('search')

  let servers = [...MARKETPLACE_SERVERS]

  if (category && category !== 'all') {
    servers = servers.filter((s) => s.category === category)
  }

  if (search) {
    const query = search.toLowerCase()
    servers = servers.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
    )
  }

  return c.json({ success: true, data: servers })
})

// 取得已安裝的 Servers
app.get('/installed', (c) => {
  // TODO: 從實際配置讀取
  const installed = [
    {
      name: 'filesystem',
      description: '讀寫本地檔案系統',
      command: 'npx',
      args: ['-y', '@anthropic/mcp-server-filesystem'],
      enabled: true,
      status: 'connected',
      tools: 5,
      resources: 0,
    },
  ]

  return c.json({ success: true, data: installed })
})

// 安裝 Server
app.post('/install/:id', async (c) => {
  const id = c.req.param('id')
  const server = MARKETPLACE_SERVERS.find((s) => s.id === id)

  if (!server) {
    return c.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Server not found' } },
      404
    )
  }

  // TODO: 實際安裝到配置
  return c.json({
    success: true,
    data: {
      ...server,
      installed: true,
      status: 'connecting',
    },
  })
})

// 卸載 Server
app.delete('/uninstall/:name', async (c) => {
  const name = c.req.param('name')

  // TODO: 從配置移除
  return c.json({ success: true, data: { name } })
})

// 更新 Server 配置
app.patch('/:name', zValidator('json', serverConfigSchema.partial()), async (c) => {
  const name = c.req.param('name')
  const body = c.req.valid('json')

  // TODO: 更新配置
  return c.json({ success: true, data: { name, ...body } })
})

// 取得 Server 的工具列表
app.get('/:name/tools', async (c) => {
  // TODO: 從實際 MCP Client 取得 (use c.req.param('name'))
  const tools = [
    {
      name: 'read_file',
      description: '讀取檔案內容',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '檔案路徑' },
        },
        required: ['path'],
      },
    },
    {
      name: 'write_file',
      description: '寫入檔案',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '檔案路徑' },
          content: { type: 'string', description: '檔案內容' },
        },
        required: ['path', 'content'],
      },
    },
  ]

  return c.json({ success: true, data: tools })
})

// 呼叫工具
app.post('/:name/tools/:tool/call', async (c) => {
  const tool = c.req.param('tool')
  const body = await c.req.json()

  // TODO: 透過 MCP Client 呼叫
  return c.json({
    success: true,
    data: {
      content: [{ type: 'text', text: `Tool ${tool} called with args: ${JSON.stringify(body)}` }],
    },
  })
})

export default app
