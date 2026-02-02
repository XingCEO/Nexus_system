'use client'

import { cn } from '@/lib/utils'

interface NodeType {
  type: string
  label: string
  category: string
  description: string
}

const NODE_TYPES: NodeType[] = [
  { type: 'trigger', label: '觸發器', category: 'trigger', description: '工作流的起始點' },
  { type: 'agent', label: 'AI 代理', category: 'agent', description: '呼叫 AI 處理任務' },
  { type: 'tool', label: '工具', category: 'agent', description: '呼叫 MCP 工具' },
  { type: 'condition', label: '條件', category: 'logic', description: '根據條件分支' },
  { type: 'loop', label: '迴圈', category: 'logic', description: '遍歷陣列' },
  { type: 'parallel', label: '並行', category: 'logic', description: '同時執行多個分支' },
  { type: 'transform', label: '轉換', category: 'data', description: '轉換資料格式' },
  { type: 'output', label: '輸出', category: 'output', description: '工作流輸出' },
]

const CATEGORIES = [
  { id: 'trigger', label: '觸發', color: 'text-yellow-500' },
  { id: 'agent', label: 'AI', color: 'text-purple-500' },
  { id: 'logic', label: '邏輯', color: 'text-cyan-500' },
  { id: 'data', label: '資料', color: 'text-pink-500' },
  { id: 'output', label: '輸出', color: 'text-red-500' },
]

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

interface WorkflowSidebarProps {
  onAddNode: (type: string, label: string) => void
}

export function WorkflowSidebar({ onAddNode }: WorkflowSidebarProps) {
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.setData('application/json', JSON.stringify(nodeType))
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="w-64 border-r border-border/50 bg-background p-4">
      <h2 className="mb-4 text-sm font-semibold">節點</h2>

      <div className="space-y-4">
        {CATEGORIES.map((category) => {
          const categoryNodes = NODE_TYPES.filter((n) => n.category === category.id)
          if (categoryNodes.length === 0) return null

          return (
            <div key={category.id}>
              <h3 className={cn('mb-2 text-xs font-medium', category.color)}>
                {category.label}
              </h3>
              <div className="space-y-1">
                {categoryNodes.map((nodeType) => (
                  <div
                    key={nodeType.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, nodeType)}
                    onClick={() => onAddNode(nodeType.type, nodeType.label)}
                    className="flex cursor-grab items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-2.5 transition-all hover:bg-card hover:border-border active:cursor-grabbing"
                  >
                    <div className={cn('flex items-center justify-center', NODE_ICON_COLORS[nodeType.type])}>
                      <NodeIcon type={nodeType.type} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm font-medium">{nodeType.label}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {nodeType.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-border/50 p-3">
        <p className="text-center text-xs text-muted-foreground">
          拖拽節點到畫布<br />
          或點擊添加
        </p>
      </div>
    </div>
  )
}
