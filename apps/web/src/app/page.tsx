'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

function NavIcon({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case 'menu':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'arrow':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    default:
      return null
  }
}

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

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7
  const hasAlmostFull = rating % 1 > 0.7
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0) - (hasAlmostFull ? 1 : 0)

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        {/* Almost full star (0.8, 0.9) */}
        {hasAlmostFull && (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <defs>
              <linearGradient id="almostFull">
                <stop offset="85%" stopColor="#facc15"/>
                <stop offset="85%" stopColor="#d1d5db"/>
              </linearGradient>
            </defs>
            <path fill="url(#almostFull)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )}
        {/* Half star */}
        {hasHalfStar && (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <defs>
              <linearGradient id="halfStar">
                <stop offset="50%" stopColor="#facc15"/>
                <stop offset="50%" stopColor="#d1d5db"/>
              </linearGradient>
            </defs>
            <path fill="url(#halfStar)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )}
        {/* Empty stars */}
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

const features = [
  { id: 'memory', title: '無限長期記憶', description: '跨會話持久化對話歷史、用戶偏好與學習經驗，真正理解你的需求' },
  { id: 'mcp', title: 'MCP 工具整合', description: '無縫連接檔案系統、資料庫、GitHub 等 50+ 外部服務' },
  { id: 'workflow', title: '工作流編排', description: '視覺化設計多步驟自動化流程，Agent 自主執行複雜任務' },
  { id: 'agent', title: 'AI 分身', description: '24/7 持續運作的個人助理，自主學習並完成你的任務' },
  { id: 'security', title: '企業級安全', description: '端到端加密、本地部署選項、完整審計日誌' },
  { id: 'speed', title: '極速響應', description: '毫秒級延遲、串流輸出、多模型智能路由' },
]

const stats = [
  { value: '∞', label: '記憶容量' },
  { value: '50+', label: 'MCP 工具' },
  { value: '99.9%', label: '可用性' },
  { value: '<100ms', label: '響應時間' },
]

const testimonialsRow1 = [
  { content: '超級系統徹底改變了我的工作方式。它真的記得我說過的每一件事，不需要重複解釋上下文。', author: 'Terry Chen', role: '資深後端工程師 @ 台積電', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5 },
  { content: 'The workflow automation is incredible. I saved 3 hours every day by automating repetitive CI/CD tasks.', author: 'Sarah Mitchell', role: 'Senior Software Engineer @ Stripe', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 4.5 },
  { content: 'MCP 整合讓我能直接操作資料庫和 GitHub，不用再切換工具，效率提升 10 倍。', author: 'Kevin Lin', role: 'DevOps 工程師 @ Appier', avatar: 'https://randomuser.me/api/portraits/men/35.jpg', rating: 5 },
  { content: '長期記憶機能が素晴らしい。プロジェクトの文脈を完全に理解してくれます。', author: 'Kenji Sato', role: 'シニアエンジニア @ メルカリ', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', rating: 4.8 },
  { content: 'Enterprise security features gave our IT team peace of mind. Finally an AI tool we can deploy at scale.', author: 'David Thompson', role: 'Staff Engineer @ Cloudflare', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', rating: 4.7 },
  { content: '응답 속도가 정말 빨라요. 지연이 전혀 느껴지지 않고 매우 부드럽게 작동합니다.', author: 'Junho Park', role: '시니어 개발자 @ 카카오', avatar: 'https://randomuser.me/api/portraits/men/29.jpg', rating: 5 },
]

const testimonialsRow2 = [
  { content: 'Managing infrastructure across multiple clouds became so much easier. The context awareness is next level.', author: 'Emily Rodriguez', role: 'Engineering Manager @ Google', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', rating: 4.6 },
  { content: '前端開發效率提升超多，它記得我們的 design system 規範，產出的 code 品質很高。', author: 'Amy Chang', role: '前端工程師 @ LINE Taiwan', avatar: 'https://randomuser.me/api/portraits/women/79.jpg', rating: 5 },
  { content: 'Die Team-Zusammenarbeit ist fantastisch. Jeder AI-Avatar arbeitet nahtlos mit unserem Tech-Stack.', author: 'Thomas Weber', role: 'Principal Engineer @ SAP', avatar: 'https://randomuser.me/api/portraits/men/52.jpg', rating: 4.9 },
  { content: 'Code review automation helped us catch so many edge cases. Our deployment frequency doubled.', author: 'Rajesh Kumar', role: 'Tech Lead @ Freshworks', avatar: 'https://randomuser.me/api/portraits/men/86.jpg', rating: 4.5 },
  { content: 'The API is well-documented and easy to integrate. Built our internal tools on top of it in just 2 weeks.', author: 'Jonathan Tan', role: 'Software Architect @ Grab', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', rating: 4.8 },
  { content: '系統架構設計時超好用，它能記住整個專案的技術決策脈絡，討論 trade-off 很有效率。', author: 'Jason Wang', role: '系統架構師 @ 趨勢科技', avatar: 'https://randomuser.me/api/portraits/men/76.jpg', rating: 4.7 },
]

const pricingPlans = [
  { name: '免費版', price: '0', description: '適合個人探索', features: ['每日 50 次對話', '基礎記憶功能', '3 個 MCP 工具', '社群支援'], cta: '免費註冊', highlighted: false, href: '/register' },
  { name: '專業版', price: '299', description: '適合專業工作者', features: ['無限對話', '完整記憶功能', '所有 MCP 工具', '工作流編排', '優先支援'], cta: '免費試用 14 天', highlighted: true, href: '/register?plan=pro' },
  { name: '企業版', price: '客製', description: '適合團隊與企業', features: ['一切專業版功能', '本地部署', '專屬客戶經理', 'SLA 保證', 'API 存取'], cta: '聯繫我們', highlighted: false, href: '/contact' },
]

export default function LandingPage() {
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

          <button className="md:hidden p-2">
            <NavIcon id="menu" className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle,rgba(120,119,198,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Grid flow effect - 數據流動感 */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(120,119,198,0.03)_25%,transparent_50%,rgba(120,119,198,0.03)_75%,transparent_100%)] bg-[size:400px_400px]"
          animate={{
            backgroundPosition: ['0px 0px', '400px 400px'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating orbs - very subtle */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full bg-foreground/[0.02] blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/5 w-96 h-96 rounded-full bg-foreground/[0.015] blur-3xl"
          animate={{
            x: [0, -35, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-foreground/[0.02] blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm text-muted-foreground">v1.0 正式發布</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 blur-3xl bg-foreground/10 rounded-full scale-150" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-xl bg-foreground text-background flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
                <Logo className="w-16 h-16 sm:w-18 sm:h-18" />
              </div>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block">你的 AI 分身</span>
            <span className="block mt-2 bg-gradient-to-r from-foreground via-foreground/70 to-foreground/40 bg-clip-text text-transparent">
              永不遺忘，自主行動
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Nexus 是帶有長期記憶的 AI Agent 平台。它能記住你說過的每一句話，連接你的所有工具，24/7 自主執行任務。
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="h-12 px-8 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 hover:scale-[1.02] hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.4)]">
              免費開始使用
              <NavIcon id="arrow" className="w-4 h-4" />
            </Link>
            <Link href="#features" className="h-12 px-8 rounded-xl border border-border/50 bg-card/50 text-sm font-medium hover:bg-card hover:border-border hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2">
              瞭解更多
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 mt-20 pt-12 border-t border-border/30">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              >
                <div className="text-4xl sm:text-5xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">強大功能，簡單使用</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">我們重新定義了 AI 助手的能力邊界，打造真正能幫你工作的智能夥伴</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="group relative p-8 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-border transition-all duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary transition-all duration-300">
                    <FeatureIcon id={feature.id} className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 sm:py-32 border-t border-border/50 bg-secondary/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">深受用戶喜愛</h2>
            <p className="text-lg text-muted-foreground">聽聽他們怎麼說</p>
          </motion.div>
        </div>

        {/* Marquee Row 1 - Left to Right */}
        <div className="relative mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[hsl(var(--secondary)/0.2)] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[hsl(var(--secondary)/0.2)] to-transparent z-10" />
          <div className="flex overflow-hidden">
            <div className="flex gap-6 animate-marquee-left">
              {[...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1].map((testimonial, i) => (
                <div key={`row1-${i}`} className="flex-shrink-0 w-[400px] p-6 rounded-2xl border border-border/50 bg-background">
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee Row 2 - Right to Left */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[hsl(var(--secondary)/0.2)] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[hsl(var(--secondary)/0.2)] to-transparent z-10" />
          <div className="flex overflow-hidden">
            <div className="flex gap-6 animate-marquee-right">
              {[...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2].map((testimonial, i) => (
                <div key={`row2-${i}`} className="flex-shrink-0 w-[400px] p-6 rounded-2xl border border-border/50 bg-background">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-32 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">簡單透明的定價</h2>
            <p className="text-lg text-muted-foreground">選擇適合你的方案，隨時升級或降級</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`relative p-8 rounded-2xl border ${plan.highlighted ? 'border-foreground bg-foreground text-background scale-105 shadow-2xl' : 'border-border/50 bg-card/30 hover:bg-card/50 hover:border-border/80'} transition-all duration-300`}>
                {plan.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-background text-foreground text-xs font-semibold shadow-lg">最受歡迎</div>}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-background/70' : 'text-muted-foreground'}`}>{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price === '客製' ? '' : 'NT$'}{plan.price}</span>
                  {plan.price !== '客製' && <span className={`text-sm ${plan.highlighted ? 'text-background/70' : 'text-muted-foreground'}`}>/月</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <NavIcon id="check" className={`w-4 h-4 ${plan.highlighted ? 'text-background' : 'text-foreground'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full h-11 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-center leading-[2.75rem] ${plan.highlighted ? 'bg-background text-foreground hover:bg-background/90 hover:shadow-lg' : 'bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg'}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(120,119,198,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight">準備好提升你的生產力了嗎？</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12">加入數千名用戶的行列，開始體驗 AI 分身帶來的改變</p>
            <Link href="/register" className="inline-flex h-12 px-8 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 hover:scale-[1.02] hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all duration-200 items-center gap-2 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.4)]">
              免費開始使用
              <NavIcon id="arrow" className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                  <Logo className="w-5 h-5" />
                </div>
                <span className="font-bold tracking-[0.15em] uppercase">Nexus</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">帶有無限記憶的 AI Agent 平台。<br />你的智能工作夥伴，24/7 自主執行任務。</p>
              <div className="flex items-center gap-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">產品</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">功能介紹</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">定價方案</Link></li>
                <li><Link href="/testimonials" className="hover:text-foreground transition-colors">用戶評價</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground transition-colors">更新日誌</Link></li>
                <li><Link href="/roadmap" className="hover:text-foreground transition-colors">產品路線圖</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">資源</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">使用文檔</Link></li>
                <li><Link href="/docs/api" className="hover:text-foreground transition-colors">API 參考</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">技術部落格</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">系統狀態</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">公司</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">關於我們</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">聯繫我們</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">加入團隊</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">隱私政策</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">服務條款</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">© 2026 Nexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
