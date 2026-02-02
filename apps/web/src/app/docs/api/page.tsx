'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

const endpoints = [
  {
    method: 'POST',
    path: '/v1/chat',
    description: '發送對話訊息',
    example: `{
  "message": "你好，請幫我分析這份報告",
  "context_id": "ctx_abc123"
}`,
  },
  {
    method: 'GET',
    path: '/v1/memories',
    description: '取得記憶列表',
    example: `{
  "memories": [
    { "id": "mem_1", "content": "用戶偏好深色主題", "created_at": "2026-01-15" }
  ]
}`,
  },
  {
    method: 'POST',
    path: '/v1/workflows',
    description: '創建工作流',
    example: `{
  "name": "每日報告",
  "steps": [
    { "type": "fetch", "source": "database" },
    { "type": "analyze", "model": "gpt-4" }
  ]
}`,
  },
  {
    method: 'GET',
    path: '/v1/agents',
    description: '列出所有 Agent',
    example: `{
  "agents": [
    { "id": "agent_1", "name": "研究助手", "status": "active" }
  ]
}`,
  },
]

const methodColors = {
  GET: 'bg-green-500/10 text-green-600',
  POST: 'bg-blue-500/10 text-blue-600',
  PUT: 'bg-orange-500/10 text-orange-600',
  DELETE: 'bg-red-500/10 text-red-600',
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold tracking-[0.2em] uppercase">Nexus</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              文檔首頁
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              返回首頁
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">API 參考</h1>
            <p className="text-lg text-muted-foreground mb-6">
              使用 Nexus API 將 AI 能力整合到你的應用中
            </p>
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
              <p className="text-sm font-mono">Base URL: <span className="text-foreground">https://api.nexus.ai</span></p>
            </div>
          </motion.div>

          <div className="space-y-8">
            {endpoints.map((endpoint, i) => (
              <motion.div
                key={endpoint.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[endpoint.method as keyof typeof methodColors]}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono">{endpoint.path}</code>
                </div>
                <p className="text-muted-foreground mb-4">{endpoint.description}</p>
                <div className="rounded-lg bg-secondary/80 p-4 overflow-x-auto">
                  <pre className="text-sm font-mono">{endpoint.example}</pre>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
