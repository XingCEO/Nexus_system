'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

const services = [
  { name: 'API 服務', status: 'operational', uptime: '99.98%' },
  { name: '對話引擎', status: 'operational', uptime: '99.95%' },
  { name: '記憶系統', status: 'operational', uptime: '99.99%' },
  { name: 'MCP 工具整合', status: 'operational', uptime: '99.90%' },
  { name: '工作流執行器', status: 'operational', uptime: '99.92%' },
  { name: '網頁應用', status: 'operational', uptime: '99.99%' },
]

const incidents = [
  {
    date: '2026-01-10',
    title: '記憶系統延遲',
    status: 'resolved',
    description: '部分用戶在記憶檢索時遇到延遲，已於 15 分鐘內修復。',
  },
  {
    date: '2025-12-28',
    title: 'API 服務維護',
    status: 'resolved',
    description: '計劃性維護，服務暫停 30 分鐘進行系統升級。',
  },
]

const statusStyles = {
  operational: { color: 'bg-green-500', label: '正常運作' },
  degraded: { color: 'bg-yellow-500', label: '效能降低' },
  outage: { color: 'bg-red-500', label: '服務中斷' },
}

export default function StatusPage() {
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
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">所有系統正常運作</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">系統狀態</h1>
            <p className="text-lg text-muted-foreground">即時監控 Nexus 服務狀態</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl border border-border/50 bg-card/30 mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">服務狀態</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${statusStyles[service.status as keyof typeof statusStyles].color}`} />
                    <span>{service.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">可用性 {service.uptime}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl border border-border/50 bg-card/30"
          >
            <h2 className="text-lg font-semibold mb-4">近期事件</h2>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.date} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-muted-foreground">{incident.date}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-600">已解決</span>
                  </div>
                  <h3 className="font-medium mb-1">{incident.title}</h3>
                  <p className="text-sm text-muted-foreground">{incident.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
