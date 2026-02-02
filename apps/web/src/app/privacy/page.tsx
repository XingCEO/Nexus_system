'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold mb-4">隱私政策</h1>
            <p className="text-muted-foreground">最後更新：2026 年 1 月 15 日</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-neutral dark:prose-invert max-w-none"
          >
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. 資料收集</h2>
              <p className="text-muted-foreground mb-4">
                我們收集您提供的資料，包括：帳戶資訊（電子郵件、姓名）、對話內容、使用偏好設定。這些資料用於提供和改進我們的服務。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. 記憶資料</h2>
              <p className="text-muted-foreground mb-4">
                Nexus 的核心功能是長期記憶。您的對話記憶會被安全儲存，僅供您個人使用。您可以隨時查看、編輯或刪除這些記憶。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. 資料安全</h2>
              <p className="text-muted-foreground mb-4">
                我們採用業界標準的加密技術保護您的資料。所有傳輸使用 TLS 加密，儲存資料使用 AES-256 加密。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. 資料分享</h2>
              <p className="text-muted-foreground mb-4">
                我們不會出售您的個人資料。僅在以下情況分享：獲得您的同意、法律要求、保護我們的權利。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. 您的權利</h2>
              <p className="text-muted-foreground mb-4">
                您有權：存取您的資料、更正不準確的資料、刪除您的資料、匯出您的資料、撤回同意。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. 聯繫我們</h2>
              <p className="text-muted-foreground">
                如有任何隱私相關問題，請聯繫 privacy@nexus.ai
              </p>
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
