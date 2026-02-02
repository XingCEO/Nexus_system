'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

const team = [
  { name: 'Alex Chen', role: '創辦人 & CEO', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Sarah Lin', role: '技術長 (CTO)', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Kevin Wang', role: '產品長 (CPO)', avatar: 'https://randomuser.me/api/portraits/men/35.jpg' },
  { name: 'Emily Zhang', role: '設計總監', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
]

const values = [
  { icon: '🧠', title: '記憶為先', description: 'AI 應該記住與你的每次互動，不斷學習和進化。' },
  { icon: '🔗', title: '無縫連接', description: 'AI 應該能與你使用的所有工具和服務整合。' },
  { icon: '🛡️', title: '隱私至上', description: '你的數據永遠屬於你，我們承諾最高級別的安全保護。' },
  { icon: '⚡', title: '自主高效', description: 'AI 應該能獨立完成任務，而不只是回答問題。' },
]

export default function AboutPage() {
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
            <h1 className="text-4xl font-bold mb-4">關於我們</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              我們相信 AI 應該是每個人的智能夥伴——記住你、理解你、為你工作。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">我們的使命</h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
              Nexus 致力於打造帶有無限記憶的 AI Agent 平台，讓每個人都能擁有一個真正理解自己、能夠自主執行任務的 AI 分身。我們相信，未來的工作方式將因 AI 而徹底改變。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold mb-8 text-center">核心價值</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value) => (
                <div key={value.title} className="p-6 rounded-2xl border border-border/50 bg-card/30">
                  <span className="text-3xl mb-4 block">{value.icon}</span>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-8 text-center">團隊成員</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
