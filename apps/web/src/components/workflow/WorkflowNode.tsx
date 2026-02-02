'use client'

import { useState, useRef } from 'react'
import { Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WorkflowNode } from './WorkflowEditor'

const NODE_COLORS: Record<string, string> = {
  trigger: 'border-yellow-500/50 bg-yellow-500/5 dark:bg-yellow-500/10',
  agent: 'border-purple-500/50 bg-purple-500/5 dark:bg-purple-500/10',
  tool: 'border-blue-500/50 bg-blue-500/5 dark:bg-blue-500/10',
  condition: 'border-cyan-500/50 bg-cyan-500/5 dark:bg-cyan-500/10',
  loop: 'border-green-500/50 bg-green-500/5 dark:bg-green-500/10',
  parallel: 'border-orange-500/50 bg-orange-500/5 dark:bg-orange-500/10',
  transform: 'border-pink-500/50 bg-pink-500/5 dark:bg-pink-500/10',
  output: 'border-red-500/50 bg-red-500/5 dark:bg-red-500/10',
}

const NODE_ICON_COLORS: Record<string, string> = {
  trigger: 'text-yellow-500',
  agent: 'text-purple-500',
  tool: 'text-blue-500',
  condition: 'text-cyan-500',
  loop: 'text-green-500',
  parallel: 'text-orange-500',
  transform: 'text-pink-500',
  output: 'text-red-500',
}

function NodeIcon({ type, className }: { type: string; className?: string }) {
  const iconClass = cn('w-4 h-4', className)

  switch (type) {
    case 'trigger':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'agent':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
        </svg>
      )
    case 'tool':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'condition':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M12 3v6m0 6v6M3 12h6m6 0h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'loop':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M17 2l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 22l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 13v1a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'parallel':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M8 6v12M16 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'transform':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M4 12h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 12h-8m0 0l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'output':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M12 5v14m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="4" y="3" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
  }
}

interface WorkflowNodeComponentProps {
  node: WorkflowNode
  selected: boolean
  onSelect: () => void
  onMove: (position: { x: number; y: number }) => void
  onDelete: () => void
  onStartConnect: () => void
  onEndConnect: () => void
  isConnecting: boolean
}

export function WorkflowNodeComponent({
  node,
  selected,
  onSelect,
  onMove,
  onDelete,
  onStartConnect,
  onEndConnect,
  isConnecting,
}: WorkflowNodeComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-handle]')) return

    e.stopPropagation()
    onSelect()

    setIsDragging(true)
    dragOffset.current = {
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    }

    const handleMouseMove = (e: MouseEvent) => {
      onMove({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className={cn(
        'absolute flex w-60 cursor-move flex-col rounded-lg border-2 bg-card shadow-md transition-shadow',
        NODE_COLORS[node.type],
        selected && 'ring-2 ring-primary ring-offset-2',
        isDragging && 'shadow-lg'
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 頂部手柄 */}
      <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
        <div className={cn('flex items-center justify-center', NODE_ICON_COLORS[node.type])}>
          <NodeIcon type={node.type} />
        </div>
        <span className="flex-1 truncate text-sm font-medium">{node.data.label}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-destructive group-hover:opacity-100"
          style={{ opacity: selected ? 1 : undefined }}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* 內容 */}
      <div className="px-3 py-2">
        <p className="text-xs text-muted-foreground">
          {node.data.description || getDefaultDescription(node.type)}
        </p>
      </div>

      {/* 輸入連接點 */}
      {node.type !== 'trigger' && (
        <div
          data-handle="input"
          className={cn(
            'absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 cursor-crosshair rounded-full border-2 border-muted-foreground bg-background transition-colors',
            isConnecting && 'border-primary bg-primary/20'
          )}
          onClick={(e) => {
            e.stopPropagation()
            onEndConnect()
          }}
        />
      )}

      {/* 輸出連接點 */}
      {node.type !== 'output' && (
        <div
          data-handle="output"
          className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 cursor-crosshair rounded-full border-2 border-muted-foreground bg-background transition-colors hover:border-primary hover:bg-primary/20"
          onMouseDown={(e) => {
            e.stopPropagation()
            onStartConnect()
          }}
        />
      )}
    </div>
  )
}

function getDefaultDescription(type: string): string {
  const descriptions: Record<string, string> = {
    trigger: '點擊配置觸發條件',
    agent: '選擇 AI 代理和模型',
    tool: '選擇要呼叫的工具',
    condition: '設定條件邏輯',
    loop: '設定迴圈範圍',
    parallel: '配置並行分支',
    transform: '設定資料轉換',
    output: '配置輸出格式',
  }
  return descriptions[type] || '點擊配置'
}
