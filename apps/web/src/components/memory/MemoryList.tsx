'use client'

import { useState, useEffect } from 'react'
import { MemoryCard } from './MemoryCard'
import { MemoryFilters } from './MemoryFilters'

interface Memory {
  id: string
  type: 'fact' | 'preference' | 'experience' | 'relationship'
  content: string
  createdAt: string
  updatedAt: string
}

export function MemoryList() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模擬載入記憶
    setIsLoading(true)
    setTimeout(() => {
      setMemories([
        {
          id: '1',
          type: 'fact',
          content: '用戶是一名全端工程師，專精於 React 和 Node.js',
          createdAt: '2025-02-01T10:00:00Z',
          updatedAt: '2025-02-01T10:00:00Z',
        },
        {
          id: '2',
          type: 'preference',
          content: '用戶偏好使用 TypeScript 而非 JavaScript',
          createdAt: '2025-02-01T11:00:00Z',
          updatedAt: '2025-02-01T11:00:00Z',
        },
        {
          id: '3',
          type: 'preference',
          content: '用戶喜歡簡潔的程式碼風格，不喜歡過度抽象',
          createdAt: '2025-02-01T12:00:00Z',
          updatedAt: '2025-02-01T12:00:00Z',
        },
        {
          id: '4',
          type: 'experience',
          content: '用戶曾經開發過一個類似 Notion 的專案管理工具',
          createdAt: '2025-02-02T09:00:00Z',
          updatedAt: '2025-02-02T09:00:00Z',
        },
        {
          id: '5',
          type: 'relationship',
          content: '用戶有一個名叫小明的同事，負責後端開發',
          createdAt: '2025-02-02T10:00:00Z',
          updatedAt: '2025-02-02T10:00:00Z',
        },
      ])
      setIsLoading(false)
    }, 500)
  }, [])

  const filteredMemories = filter === 'all'
    ? memories
    : memories.filter((m) => m.type === filter)

  const handleDelete = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id))
  }

  const handleEdit = (id: string, content: string) => {
    setMemories((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, content, updatedAt: new Date().toISOString() } : m
      )
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MemoryFilters current={filter} onChange={setFilter} counts={{
        all: memories.length,
        fact: memories.filter((m) => m.type === 'fact').length,
        preference: memories.filter((m) => m.type === 'preference').length,
        experience: memories.filter((m) => m.type === 'experience').length,
        relationship: memories.filter((m) => m.type === 'relationship').length,
      }} />

      {filteredMemories.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            {filter === 'all' ? '還沒有任何記憶' : `沒有「${getTypeLabel(filter)}」類型的記憶`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            透過對話，AI 會自動記住重要資訊
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    fact: '事實',
    preference: '偏好',
    experience: '經驗',
    relationship: '關係',
  }
  return labels[type] || type
}
