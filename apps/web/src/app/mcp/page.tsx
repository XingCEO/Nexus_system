'use client'

import { MCPMarketplace } from '@/components/mcp/MCPMarketplace'
import { MCPHeader } from '@/components/mcp/MCPHeader'
import { AuthGuard } from '@/components/AuthGuard'

export default function MCPPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <MCPHeader />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            <MCPMarketplace />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
