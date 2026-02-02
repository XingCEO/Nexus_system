'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

const roadmapItems = [
  {
    quarter: 'Q1 2026',
    status: 'completed',
    title: '基礎平台',
    items: [
      { text: '長期記憶系統', done: true },
      { text: 'MCP 工具整合 (50+)', done: true },
      { text: '工作流編排器', done: true },
      { text: 'AI Agent 自主執行', done: true },
    ],
  },
  {
    quarter: 'Q2 2026',
    status: 'in-progress',
    title: '協作與擴展',
    items: [
      { text: '團隊協作空間', done: false },
      { text: 'Agent 市集', done: false },
      { text: '自定義 MCP 工具 SDK', done: false },
      { text: '多模態支援（圖片、語音）', done: false },
    ],
  },
  {
    quarter: 'Q3 2026',
    status: 'planned',
    title: '企業功能',
    items: [
      { text: '本地部署方案', done: false },
      { text: 'SSO / SAML 整合', done: false },
      { text: '進階審計日誌', done: false },
      { text: 'API 速率限制控制', done: false },
    ],
  },
  {
    quarter: 'Q4 2026',
    status: 'planned',
    title: '智能進化',
    items: [
      { text: 'Agent 自我學習優化', done: false },
      { text: '跨 Agent 知識共享', done: false },
      { text: '預測性任務建議', done: false },
      { text: '自然語言工作流創建', done: false },
    ],
  },
]

const statusStyles = {
  completed: 'bg-green-500',
  'in-progress': 'bg-blue-500 animate-pulse',
  planned: 'bg-muted-foreground/30',
}

const statusLabels = {
  completed: '已完成',
  'in-progress': '進行中',
  planned: '規劃中',
}

export default function RoadmapPage() {
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
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">產品路線圖</h1>
            <p className="text-lg text-muted-foreground">
              我們的願景與未來規劃
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {roadmapItems.map((quarter, i) => (
              <motion.div
                key={quarter.quarter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${statusStyles[quarter.status as keyof typeof statusStyles]}`} />
                  <span className="font-bold">{quarter.quarter}</span>
                  <span className="text-xs text-muted-foreground">
                    {statusLabels[quarter.status as keyof typeof statusLabels]}
                  </span>
                </div>
                <h2 className="text-lg font-semibold mb-4">{quarter.title}</h2>
                <ul className="space-y-2">
                  {quarter.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      {item.done ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={item.done ? 'text-muted-foreground line-through' : ''}>
                        {item.text}
                      </span>
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
