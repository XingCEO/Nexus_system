'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function TermsPage() {
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
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">服務條款</h1>
            <p className="text-muted-foreground">最後更新：2026 年 1 月 15 日</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-neutral dark:prose-invert max-w-none"
          >
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. 服務說明</h2>
              <p className="text-muted-foreground mb-4">
                Nexus 是一個帶有長期記憶的 AI Agent 平台。使用我們的服務即表示您同意這些條款。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. 帳戶責任</h2>
              <p className="text-muted-foreground mb-4">
                您需要保護您的帳戶安全。您對帳戶下的所有活動負責。如發現未授權使用，請立即通知我們。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. 可接受的使用</h2>
              <p className="text-muted-foreground mb-4">
                您同意不會：違反任何法律、侵犯他人權利、傳播惡意軟體、濫用或干擾服務、未經授權存取系統。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. 智慧財產權</h2>
              <p className="text-muted-foreground mb-4">
                Nexus 服務及其內容受著作權和其他法律保護。您保留您創建內容的所有權，但授予我們提供服務所需的使用許可。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. 付款條款</h2>
              <p className="text-muted-foreground mb-4">
                付費方案按月或按年計費。您可以隨時取消訂閱。退款依據我們的退款政策處理。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. 免責聲明</h2>
              <p className="text-muted-foreground mb-4">
                服務按「現狀」提供。我們不保證服務不會中斷或無錯誤。AI 生成的內容可能包含錯誤，請自行驗證重要資訊。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. 責任限制</h2>
              <p className="text-muted-foreground mb-4">
                在法律允許的最大範圍內，我們對任何間接、附帶或衍生損害不承擔責任。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. 條款變更</h2>
              <p className="text-muted-foreground mb-4">
                我們可能會更新這些條款。重大變更會透過電子郵件或服務內通知。繼續使用服務即表示接受新條款。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. 聯繫方式</h2>
              <p className="text-muted-foreground">
                如有任何問題，請聯繫 legal@nexus.ai
              </p>
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
