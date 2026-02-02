'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

function FeatureIcon({ id, className }: { id: string; className?: string }) {
  const iconClass = className || 'w-6 h-6'

  switch (id) {
    case 'memory':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
          <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
          <circle cx="12" cy="4" r="1.5" fill="currentColor" fillOpacity="0.5"/>
          <circle cx="12" cy="20" r="1.5" fill="currentColor" fillOpacity="0.5"/>
          <circle cx="4" cy="12" r="1.5" fill="currentColor" fillOpacity="0.5"/>
          <circle cx="20" cy="12" r="1.5" fill="currentColor" fillOpacity="0.5"/>
        </svg>
      )
    case 'mcp':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 6.5h4M17.5 10v4M6.5 14v4M14 17.5h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
          <circle cx="17.5" cy="6.5" r="2.5" fill="currentColor" fillOpacity="0.3"/>
          <circle cx="6.5" cy="17.5" r="2.5" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      )
    case 'workflow':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M4 6h6M14 6h6M4 12h16M4 18h6M14 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
          <circle cx="12" cy="6" r="2" fill="currentColor"/>
          <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.7"/>
          <circle cx="12" cy="18" r="2" fill="currentColor" fillOpacity="0.5"/>
          <path d="M12 8v2M12 14v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 'agent':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
          <path d="M17 4l2-2M7 4L5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
        </svg>
      )
    case 'security':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'speed':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      )
    default:
      return null
  }
}

const features = [
  {
    id: 'memory',
    title: '無限長期記憶',
    description: '跨會話持久化對話歷史、用戶偏好與學習經驗，真正理解你的需求',
    details: [
      '自動提取並儲存重要資訊',
      '智能關聯相關記憶',
      '支援手動標記重要對話',
      '隱私優先，完全控制資料'
    ]
  },
  {
    id: 'mcp',
    title: 'MCP 工具整合',
    description: '無縫連接檔案系統、資料庫、GitHub 等 50+ 外部服務',
    details: [
      '一鍵連接常用開發工具',
      '自動處理認證與權限',
      '支援自定義 MCP 伺服器',
      '即時同步資料狀態'
    ]
  },
  {
    id: 'workflow',
    title: '工作流編排',
    description: '視覺化設計多步驟自動化流程，Agent 自主執行複雜任務',
    details: [
      '拖拽式流程設計器',
      '條件分支與迴圈支援',
      '定時觸發與事件驅動',
      '執行歷史與除錯工具'
    ]
  },
  {
    id: 'agent',
    title: 'AI 分身',
    description: '24/7 持續運作的個人助理，自主學習並完成你的任務',
    details: [
      '主動監控與通知',
      '自動學習工作習慣',
      '多 Agent 協作',
      '可自定義人格與風格'
    ]
  },
  {
    id: 'security',
    title: '企業級安全',
    description: '端到端加密、本地部署選項、完整審計日誌',
    details: [
      'SOC 2 Type II 認證',
      'GDPR 合規',
      '細粒度權限控制',
      '資料不用於模型訓練'
    ]
  },
  {
    id: 'speed',
    title: '極速響應',
    description: '毫秒級延遲、串流輸出、多模型智能路由',
    details: [
      '全球 CDN 加速',
      '智能模型選擇',
      '串流即時輸出',
      '離線快取支援'
    ]
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold tracking-[0.2em] uppercase">Nexus</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-foreground font-medium">功能</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">定價</Link>
            <Link href="/testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">評價</Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">登入</Link>
            <Link href="/register" className="h-9 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 flex items-center">
              免費開始
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            強大功能，簡單使用
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            我們重新定義了 AI 助手的能力邊界，打造真正能幫你工作的智能夥伴
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-8 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-border transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-secondary/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-secondary transition-all duration-300">
                    <FeatureIcon id={feature.id} className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-foreground flex-shrink-0">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">準備好體驗了嗎？</h2>
          <p className="text-lg text-muted-foreground mb-10">立即免費開始，探索 Nexus 的所有功能</p>
          <Link href="/register" className="inline-flex h-12 px-8 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 items-center gap-2 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.4)]">
            免費開始使用
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
