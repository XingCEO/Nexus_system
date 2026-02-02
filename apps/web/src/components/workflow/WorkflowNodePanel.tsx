'use client'

import { X } from 'lucide-react'
import type { WorkflowNode } from './WorkflowEditor'

interface WorkflowNodePanelProps {
  node: WorkflowNode
  onUpdate: (data: Partial<WorkflowNode['data']>) => void
  onClose: () => void
}

export function WorkflowNodePanel({ node, onUpdate, onClose }: WorkflowNodePanelProps) {
  return (
    <div className="w-80 border-l bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold">節點配置</h3>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {/* 基本資訊 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">名稱</label>
          <input
            type="text"
            value={node.data.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">描述</label>
          <textarea
            value={node.data.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="選填描述..."
          />
        </div>

        {/* 節點特定配置 */}
        {renderNodeConfig(node, onUpdate)}
      </div>
    </div>
  )
}

function renderNodeConfig(
  node: WorkflowNode,
  onUpdate: (data: Partial<WorkflowNode['data']>) => void
) {
  const updateConfig = (key: string, value: unknown) => {
    onUpdate({ config: { ...node.data.config, [key]: value } })
  }

  switch (node.type) {
    case 'trigger':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">觸發類型</label>
            <select
              value={(node.data.config.triggerType as string) || 'manual'}
              onChange={(e) => updateConfig('triggerType', e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="manual">手動觸發</option>
              <option value="scheduled">定時觸發</option>
              <option value="webhook">Webhook</option>
              <option value="event">事件觸發</option>
            </select>
          </div>

          {node.data.config.triggerType === 'scheduled' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Cron 表達式</label>
              <input
                type="text"
                value={(node.data.config.cron as string) || ''}
                onChange={(e) => updateConfig('cron', e.target.value)}
                placeholder="0 9 * * *"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
        </div>
      )

    case 'agent':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">模型</label>
            <select
              value={(node.data.config.model as string) || 'claude-3-sonnet'}
              onChange={(e) => updateConfig('model', e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              <option value="claude-3-haiku">Claude 3 Haiku</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">系統提示</label>
            <textarea
              value={(node.data.config.systemPrompt as string) || ''}
              onChange={(e) => updateConfig('systemPrompt', e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="輸入系統提示..."
            />
          </div>
        </div>
      )

    case 'tool':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">工具名稱</label>
            <input
              type="text"
              value={(node.data.config.toolName as string) || ''}
              onChange={(e) => updateConfig('toolName', e.target.value)}
              placeholder="server__tool_name"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">參數 (JSON)</label>
            <textarea
              value={JSON.stringify(node.data.config.args || {}, null, 2)}
              onChange={(e) => {
                try {
                  updateConfig('args', JSON.parse(e.target.value))
                } catch {
                  // 忽略 JSON 解析錯誤
                }
              }}
              rows={4}
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="{}"
            />
          </div>
        </div>
      )

    case 'condition':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">運算符</label>
            <select
              value={(node.data.config.operator as string) || 'eq'}
              onChange={(e) => updateConfig('operator', e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="eq">等於</option>
              <option value="neq">不等於</option>
              <option value="gt">大於</option>
              <option value="lt">小於</option>
              <option value="contains">包含</option>
              <option value="empty">為空</option>
              <option value="notEmpty">非空</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">比較值</label>
            <input
              type="text"
              value={(node.data.config.compareValue as string) || ''}
              onChange={(e) => updateConfig('compareValue', e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )

    case 'transform':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">轉換類型</label>
            <select
              value={(node.data.config.transformType as string) || 'extract'}
              onChange={(e) => updateConfig('transformType', e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="parseJson">JSON 解析</option>
              <option value="stringify">JSON 序列化</option>
              <option value="extract">提取欄位</option>
              <option value="template">模板</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">表達式</label>
            <input
              type="text"
              value={(node.data.config.expression as string) || ''}
              onChange={(e) => updateConfig('expression', e.target.value)}
              placeholder="data.field"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )

    case 'output':
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">輸出名稱</label>
          <input
            type="text"
            value={(node.data.config.outputName as string) || 'result'}
            onChange={(e) => updateConfig('outputName', e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )

    default:
      return (
        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          此節點類型暫無配置選項
        </div>
      )
  }
}
