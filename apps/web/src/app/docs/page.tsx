'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

const docSections = [
  {
    title: '快速開始',
    icon: '🚀',
    items: [
      { title: '安裝與設定', href: '#', description: '5 分鐘內開始使用 Nexus' },
      { title: '第一個對話', href: '#', description: '與 AI 進行首次互動' },
      { title: '建立記憶', href: '#', description: '讓 AI 記住你的偏好' },
    ],
  },
  {
    title: '核心功能',
    icon: '⚡',
    items: [
      { title: '長期記憶', href: '#', description: '跨會話持久化記憶系統' },
      { title: 'MCP 工具', href: '#', description: '連接外部服務與 API' },
      { title: '工作流編排', href: '#', description: '自動化多步驟任務' },
      { title: 'AI Agent', href: '#', description: '24/7 自主執行任務' },
    ],
  },
  {
    title: '進階指南',
    icon: '📚',
    items: [
      { title: '自定義 Agent', href: '#', description: '打造專屬 AI 助手' },
      { title: '工作流模板', href: '#', description: '使用預建模板快速上手' },
      { title: '團隊協作', href: '#', description: '多人共享 Agent 與記憶' },
    ],
  },
  {
    title: '開發者資源',
    icon: '🛠️',
    items: [
      { title: 'API 參考', href: '/docs/api', description: '完整 API 文檔' },
      { title: 'SDK 指南', href: '#', description: 'JavaScript / Python SDK' },
      { title: 'Webhook', href: '#', description: '事件通知設定' },
    ],
  },
]

export default function DocsPage() {
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
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            返回首頁
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">使用文檔</h1>
            <p className="text-lg text-muted-foreground">
              學習如何充分利用 Nexus 的所有功能
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {docSections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <ul className="space-y-4">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="block p-3 -mx-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="font-medium mb-1">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
