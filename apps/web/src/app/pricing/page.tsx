'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

function NavIcon({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case 'check':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'arrow':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return null
  }
}

const pricingPlans = [
  {
    name: '免費版',
    price: '0',
    description: '適合個人探索',
    features: ['每日 50 次對話', '基礎記憶功能', '3 個 MCP 工具', '社群支援'],
    cta: '免費註冊',
    highlighted: false,
    href: '/register'
  },
  {
    name: '專業版',
    price: '299',
    description: '適合專業工作者',
    features: ['無限對話', '完整記憶功能', '所有 MCP 工具', '工作流編排', '優先支援'],
    cta: '免費試用 14 天',
    highlighted: true,
    href: '/register?plan=pro'
  },
  {
    name: '企業版',
    price: '客製',
    description: '適合團隊與企業',
    features: ['一切專業版功能', '本地部署', '專屬客戶經理', 'SLA 保證', 'API 存取'],
    cta: '聯繫我們',
    highlighted: false,
    href: '/contact'
  },
]

const faqs = [
  { q: '可以隨時取消訂閱嗎？', a: '是的，您可以隨時取消訂閱，不會收取任何額外費用。取消後，您仍可使用到當前計費週期結束。' },
  { q: '免費版有什麼限制？', a: '免費版每日限制 50 次對話，支援 3 個 MCP 工具，記憶功能為基礎版本。適合個人探索和輕度使用。' },
  { q: '企業版可以本地部署嗎？', a: '是的，企業版支援完全本地部署，您的資料不會離開您的伺服器。我們提供完整的部署支援和技術文檔。' },
  { q: '如何升級或降級方案？', a: '您可以在設定頁面隨時調整方案。升級立即生效，降級則在下個計費週期生效。' },
]

export default function PricingPage() {
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
            <Link href="/pricing" className="text-sm text-foreground font-medium">定價</Link>
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
            簡單透明的定價
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            選擇適合你的方案，隨時升級或降級
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl border ${plan.highlighted ? 'border-foreground bg-foreground text-background scale-105 shadow-2xl' : 'border-border/50 bg-card/30 hover:bg-card/50 hover:border-border/80'} transition-all duration-300`}
              >
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

      {/* FAQ */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">常見問題</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl border border-border/50 bg-card/30"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">還有疑問？</h2>
          <p className="text-lg text-muted-foreground mb-10">聯繫我們的銷售團隊，獲取專屬方案</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex h-12 px-8 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 items-center gap-2 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.4)]">
              免費開始使用
              <NavIcon id="arrow" className="w-4 h-4" />
            </Link>
            <button className="h-12 px-8 rounded-xl border border-border/50 bg-card/50 text-sm font-medium hover:bg-card hover:border-border transition-all">
              聯繫銷售
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
