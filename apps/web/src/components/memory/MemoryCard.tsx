'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Memory {
  id: string
  type: 'fact' | 'preference' | 'experience' | 'relationship'
  content: string
  createdAt: string
  updatedAt: string
}

interface MemoryCardProps {
  memory: Memory
  onDelete: (id: string) => void
  onEdit: (id: string, content: string) => void
}

const typeConfig = {
  fact: { label: '事實', color: 'bg-blue-500', icon: '📌' },
  preference: { label: '偏好', color: 'bg-pink-500', icon: '❤️' },
  experience: { label: '經驗', color: 'bg-amber-500', icon: '💼' },
  relationship: { label: '關係', color: 'bg-green-500', icon: '👥' },
}

export function MemoryCard({ memory, onDelete, onEdit }: MemoryCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(memory.content)
  const [isDeleting, setIsDeleting] = useState(false)

  const config = typeConfig[memory.type]

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(memory.id, editContent.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditContent(memory.content)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (isDeleting) {
      onDelete(memory.id)
    } else {
      setIsDeleting(true)
      setTimeout(() => setIsDeleting(false), 3000)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="group rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white',
                config.color
              )}
            >
              <span>{config.icon}</span>
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(memory.createdAt)}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="h-3 w-3" />
                  儲存
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80"
                >
                  <X className="h-3 w-3" />
                  取消
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground">{memory.content}</p>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="編輯"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                isDeleting
                  ? 'bg-destructive text-destructive-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              title={isDeleting ? '再點一次確認刪除' : '刪除'}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
