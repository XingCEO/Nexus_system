'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

const releases = [
  {
    version: 'v1.0.0',
    date: '2026-01-15',
    title: '正式版發布',
    type: 'major',
    changes: [
      { type: 'feature', text: '完整的長期記憶系統，支援跨會話持久化' },
      { type: 'feature', text: 'MCP 工具整合，支援 50+ 外部服務' },
      { type: 'feature', text: '視覺化工作流編排器' },
      { type: 'feature', text: 'AI Agent 24/7 自主執行任務' },
      { type: 'feature', text: '企業級安全性：端到端加密' },
    ],
  },
  {
    version: 'v0.9.0',
    date: '2025-12-20',
    title: '公開測試版',
    type: 'minor',
    changes: [
      { type: 'feature', text: '新增 GitHub、GitLab MCP 整合' },
      { type: 'feature', text: '工作流模板庫' },
      { type: 'improvement', text: '記憶檢索速度提升 3 倍' },
      { type: 'fix', text: '修復長對話中斷問題' },
    ],
  },
  {
    version: 'v0.8.0',
    date: '2025-11-10',
    title: '記憶系統升級',
    type: 'minor',
    changes: [
      { type: 'feature', text: '向量記憶搜尋功能' },
      { type: 'feature', text: '記憶時間軸視覺化' },
      { type: 'improvement', text: '對話回應速度優化' },
      { type: 'fix', text: '修復多語言支援問題' },
    ],
  },
  {
    version: 'v0.7.0',
    date: '2025-10-01',
    title: '工作流引擎',
    type: 'minor',
    changes: [
      { type: 'feature', text: '拖放式工作流設計器' },
      { type: 'feature', text: '條件分支與循環支援' },
      { type: 'feature', text: '排程執行功能' },
    ],
  },
]

const typeColors = {
  feature: 'bg-green-500/10 text-green-600 dark:text-green-400',
  improvement: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  fix: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
}

const typeLabels = {
  feature: '新功能',
  improvement: '改進',
  fix: '修復',
}

export default function ChangelogPage() {
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
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">更新日誌</h1>
            <p className="text-lg text-muted-foreground">
              追蹤 Nexus 的所有更新與改進
            </p>
          </motion.div>

          <div className="space-y-12">
            {releases.map((release, i) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-8 border-l-2 border-border"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-foreground" />
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold">{release.version}</span>
                    <span className="text-sm text-muted-foreground">{release.date}</span>
                  </div>
                  <h2 className="text-lg font-medium text-muted-foreground">{release.title}</h2>
                </div>
                <ul className="space-y-2">
                  {release.changes.map((change, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[change.type as keyof typeof typeColors]}`}>
                        {typeLabels[change.type as keyof typeof typeLabels]}
                      </span>
                      <span className="text-sm">{change.text}</span>
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
