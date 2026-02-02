'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

const posts = [
  {
    title: '打造無限記憶的 AI：我們如何設計 Nexus 的記憶系統',
    excerpt: '深入探討 Nexus 如何使用向量資料庫與語意檢索技術，實現跨會話的長期記憶功能。',
    date: '2026-01-20',
    author: 'Alex Chen',
    category: '技術深度',
    readTime: '8 分鐘',
  },
  {
    title: 'MCP 協議：連接 AI 與世界的橋樑',
    excerpt: '介紹 Model Context Protocol 如何讓 AI 安全地與外部工具和服務互動。',
    date: '2026-01-15',
    author: 'Sarah Lin',
    category: '產品設計',
    readTime: '6 分鐘',
  },
  {
    title: '從 0 到 1：使用 Nexus 工作流自動化你的日常任務',
    excerpt: '實戰教學，展示如何建立自動化工作流來處理重複性任務。',
    date: '2026-01-10',
    author: 'Kevin Wang',
    category: '使用教學',
    readTime: '10 分鐘',
  },
  {
    title: 'AI Agent 的未來：自主、協作、進化',
    excerpt: '探討 AI Agent 技術的發展趨勢，以及 Nexus 的長期願景。',
    date: '2026-01-05',
    author: 'Alex Chen',
    category: '產業觀點',
    readTime: '5 分鐘',
  },
]

const categoryColors: Record<string, string> = {
  '技術深度': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  '產品設計': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  '使用教學': 'bg-green-500/10 text-green-600 dark:text-green-400',
  '產業觀點': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
}

export default function BlogPage() {
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
            <h1 className="text-4xl font-bold mb-4">技術部落格</h1>
            <p className="text-lg text-muted-foreground">
              產品更新、技術分享、使用技巧
            </p>
          </motion.div>

          <div className="space-y-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                  <span className="text-sm text-muted-foreground">· {post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="text-sm text-muted-foreground">
                  作者：{post.author}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
