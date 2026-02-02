import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import memories from './routes/memories'
import mcp from './routes/mcp'
import workflows from './routes/workflows'

const app = new Hono()

// 中間件
app.use('*', logger())
app.use('*', cors())

// 健康檢查
app.get('/', (c) => {
  return c.json({
    name: '超級系統 API',
    version: '0.3.0',
    status: 'healthy',
  })
})

// 路由
app.route('/api/memories', memories)
app.route('/api/mcp', mcp)
app.route('/api/workflows', workflows)

// 404
app.notFound((c) => {
  return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }, 404)
})

// 錯誤處理
app.onError((err, c) => {
  console.error(err)
  return c.json(
    { success: false, error: { code: 'INTERNAL_ERROR', message: err.message } },
    500
  )
})

export default {
  port: 3001,
  fetch: app.fetch,
}
