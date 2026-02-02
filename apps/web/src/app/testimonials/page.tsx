'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7
  const hasAlmostFull = rating % 1 > 0.7
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0) - (hasAlmostFull ? 1 : 0)

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        {hasAlmostFull && (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <defs>
              <linearGradient id="almostFullT">
                <stop offset="85%" stopColor="#facc15"/>
                <stop offset="85%" stopColor="#d1d5db"/>
              </linearGradient>
            </defs>
            <path fill="url(#almostFullT)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )}
        {hasHalfStar && (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <defs>
              <linearGradient id="halfStarT">
                <stop offset="50%" stopColor="#facc15"/>
                <stop offset="50%" stopColor="#d1d5db"/>
              </linearGradient>
            </defs>
            <path fill="url(#halfStarT)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-300 dark:text-gray-600">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
      <span className="text-xs text-muted-foreground font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}

const testimonials = [
  { content: '超級系統徹底改變了我的工作方式。它真的記得我說過的每一件事，不需要重複解釋上下文。', author: 'Terry Chen', role: '資深後端工程師 @ 台積電', avatar: 'https://i.pravatar.cc/100?img=60', rating: 5 },
  { content: 'The workflow automation is incredible. I saved 3 hours every day by automating repetitive CI/CD tasks.', author: 'Sarah Mitchell', role: 'Senior Software Engineer @ Stripe', avatar: 'https://i.pravatar.cc/100?img=47', rating: 4.5 },
  { content: 'MCP 整合讓我能直接操作資料庫和 GitHub，不用再切換工具，效率提升 10 倍。', author: 'Kevin Lin', role: 'DevOps 工程師 @ Appier', avatar: 'https://i.pravatar.cc/100?img=59', rating: 5 },
  { content: '長期記憶機能が素晴らしい。プロジェクトの文脈を完全に理解してくれます。', author: 'Kenji Sato', role: 'シニアエンジニア @ メルカリ', avatar: 'https://i.pravatar.cc/100?img=51', rating: 4.8 },
  { content: 'Enterprise security features gave our IT team peace of mind. Finally an AI tool we can deploy at scale.', author: 'David Thompson', role: 'Staff Engineer @ Cloudflare', avatar: 'https://i.pravatar.cc/100?img=68', rating: 4.7 },
  { content: '응답 속도가 정말 빨라요. 지연이 전혀 느껴지지 않고 매우 부드럽게 작동합니다.', author: 'Junho Park', role: '시니어 개발자 @ 카카오', avatar: 'https://i.pravatar.cc/100?img=52', rating: 5 },
  { content: 'Managing infrastructure across multiple clouds became so much easier. The context awareness is next level.', author: 'Emily Rodriguez', role: 'Engineering Manager @ Google', avatar: 'https://i.pravatar.cc/100?img=45', rating: 4.6 },
  { content: '前端開發效率提升超多，它記得我們的 design system 規範，產出的 code 品質很高。', author: 'Amy Chang', role: '前端工程師 @ LINE Taiwan', avatar: 'https://i.pravatar.cc/100?img=44', rating: 5 },
  { content: 'Die Team-Zusammenarbeit ist fantastisch. Jeder AI-Avatar arbeitet nahtlos mit unserem Tech-Stack.', author: 'Thomas Weber', role: 'Principal Engineer @ SAP', avatar: 'https://i.pravatar.cc/100?img=53', rating: 4.9 },
  { content: 'Code review automation helped us catch so many edge cases. Our deployment frequency doubled.', author: 'Rajesh Kumar', role: 'Tech Lead @ Freshworks', avatar: 'https://i.pravatar.cc/100?img=55', rating: 4.5 },
  { content: 'The API is well-documented and easy to integrate. Built our internal tools on top of it in just 2 weeks.', author: 'Jonathan Tan', role: 'Software Architect @ Grab', avatar: 'https://i.pravatar.cc/100?img=58', rating: 4.8 },
  { content: '系統架構設計時超好用，它能記住整個專案的技術決策脈絡，討論 trade-off 很有效率。', author: 'Jason Wang', role: '系統架構師 @ 趨勢科技', avatar: 'https://i.pravatar.cc/100?img=61', rating: 4.7 },
]

const stats = [
  { value: '10,000+', label: '活躍用戶' },
  { value: '4.8/5', label: '平均評分' },
  { value: '50M+', label: '處理訊息' },
  { value: '99.9%', label: '滿意度' },
]

export default function TestimonialsPage() {
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
            <Link href="/testimonials" className="text-sm text-foreground font-medium">評價</Link>
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
            深受用戶喜愛
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            來自全球各行各業的專業人士分享他們的使用體驗
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50 bg-secondary/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>
                <p className="text-sm leading-relaxed mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-medium">{testimonial.author}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">加入他們的行列</h2>
          <p className="text-lg text-muted-foreground mb-10">開始體驗 AI 分身帶來的改變</p>
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
