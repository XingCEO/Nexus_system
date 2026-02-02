'use client'

import Link from 'next/link'
import { ArrowLeft, Play, Save, Undo, Redo, Settings } from 'lucide-react'

interface WorkflowHeaderProps {
  workflowName?: string
  onSave?: () => void
  onRun?: () => void
}

export function WorkflowHeader({ workflowName = '新工作流', onSave, onRun }: WorkflowHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2">
          <input
            type="text"
            defaultValue={workflowName}
            className="border-none bg-transparent text-lg font-semibold focus:outline-none focus:ring-0"
          />
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            草稿
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* 歷史操作 */}
        <div className="flex items-center gap-1 border-r pr-2">
          <button
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            disabled
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            disabled
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* 設定 */}
        <button className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Settings className="h-4 w-4" />
        </button>

        {/* 儲存 */}
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Save className="h-4 w-4" />
          儲存
        </button>

        {/* 執行 */}
        <button
          onClick={onRun}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Play className="h-4 w-4" />
          執行
        </button>
      </div>
    </header>
  )
}
