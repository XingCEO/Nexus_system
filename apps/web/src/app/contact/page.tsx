'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    size: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setIsSubmitting(false)
  }

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
            <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">功能</Link>
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
            聯繫銷售團隊
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            獲取企業版專屬方案，享受本地部署、專屬支援與客製化服務
          </motion.p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-xl mx-auto px-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-green-500">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">感謝您的聯繫</h2>
              <p className="text-muted-foreground mb-8">我們的銷售團隊會在 24 小時內與您聯繫</p>
              <Link href="/" className="inline-flex h-11 px-6 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all items-center">
                返回首頁
              </Link>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">姓名 *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">公司信箱 *</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">公司名稱 *</label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="size" className="text-sm font-medium">公司規模</label>
                  <select
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  >
                    <option value="">請選擇</option>
                    <option value="1-10">1-10 人</option>
                    <option value="11-50">11-50 人</option>
                    <option value="51-200">51-200 人</option>
                    <option value="201-1000">201-1000 人</option>
                    <option value="1000+">1000+ 人</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">需求說明</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  placeholder="請描述您的需求，例如：預計使用人數、特殊功能需求、部署方式等"
                  className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? '提交中...' : '提交諮詢'}
              </button>

              <p className="text-xs text-center text-muted-foreground">
                提交即表示您同意我們的{' '}
                <Link href="/privacy" className="underline hover:text-foreground">隱私政策</Link>
              </p>
            </motion.form>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 border-t border-border/50 bg-secondary/10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">企業版專屬權益</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '本地部署', desc: '資料完全掌控在您的伺服器' },
              { title: '專屬客戶經理', desc: '一對一技術支援與諮詢' },
              { title: 'SLA 保證', desc: '99.99% 可用性承諾' },
              { title: '無限 API', desc: '不限量 API 調用額度' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-border/50 bg-background">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
