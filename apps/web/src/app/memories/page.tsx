'use client'

import { MemoryList } from '@/components/memory/MemoryList'
import { MemoryHeader } from '@/components/memory/MemoryHeader'
import { AuthGuard } from '@/components/AuthGuard'

export default function MemoriesPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <MemoryHeader />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-4xl">
            <MemoryList />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
