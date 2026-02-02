'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

const jobs = [
  {
    title: '資深後端工程師',
    department: '工程',
    location: '台北 / 遠端',
    type: '全職',
    description: '負責設計和開發 Nexus 核心服務，包括記憶系統、工作流引擎等。',
  },
  {
    title: '前端工程師',
    department: '工程',
    location: '台北 / 遠端',
    type: '全職',
    description: '打造流暢的用戶體驗，使用 React、Next.js 開發產品介面。',
  },
  {
    title: 'AI/ML 工程師',
    department: '研究',
    location: '台北 / 遠端',
    type: '全職',
    description: '研究和實作先進的 AI 模型，優化記憶檢索和對話品質。',
  },
  {
    title: '產品設計師',
    department: '設計',
    location: '台北',
    type: '全職',
    description: '設計直覺且美觀的產品體驗，從用戶研究到視覺設計。',
  },
  {
    title: '技術寫手',
    department: '產品',
    location: '遠端',
    type: '兼職',
    description: '撰寫技術文檔、教學指南和部落格文章。',
  },
]

const benefits = [
  '彈性工作時間與遠端選項',
  '具競爭力的薪資與股票選擇權',
  '年度學習津貼 NT$50,000',
  '健康保險與心理諮詢',
  '每年 20 天特休假',
  '最新 MacBook Pro 與設備',
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
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

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">加入團隊</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              與我們一起打造 AI 的未來。我們正在尋找充滿熱情的人才。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold mb-6">為什麼加入 Nexus？</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-6">開放職位</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.title} className="p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.department}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{job.location}</div>
                      <div>{job.type}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
