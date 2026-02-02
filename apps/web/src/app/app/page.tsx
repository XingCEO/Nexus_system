'use client'

import { Chat } from '@/components/chat/Chat'
import { AuthGuard } from '@/components/AuthGuard'

export default function AppPage() {
  return (
    <AuthGuard>
      <main className="flex min-h-screen flex-col">
        <Chat />
      </main>
    </AuthGuard>
  )
}
