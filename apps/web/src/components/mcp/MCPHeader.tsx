'use client'

import Link from 'next/link'
import { ArrowLeft, RefreshCw, Settings } from 'lucide-react'

export function MCPHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">MCP 工具市場</h1>
            <p className="text-sm text-muted-foreground">
              為你的 AI 助手安裝強大的工具
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <RefreshCw className="h-4 w-4" />
            重新整理
          </button>
          <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Settings className="h-4 w-4" />
            設定
          </button>
        </div>
      </div>
    </header>
  )
}
