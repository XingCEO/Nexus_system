'use client'

import { cn } from '@/lib/utils'

interface MemoryFiltersProps {
  current: string
  onChange: (filter: string) => void
  counts: Record<string, number>
}

const filters = [
  { id: 'all', label: '全部', icon: '📋' },
  { id: 'fact', label: '事實', icon: '📌' },
  { id: 'preference', label: '偏好', icon: '❤️' },
  { id: 'experience', label: '經驗', icon: '💼' },
  { id: 'relationship', label: '關係', icon: '👥' },
]

export function MemoryFilters({ current, onChange, counts }: MemoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            current === filter.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <span>{filter.icon}</span>
          <span>{filter.label}</span>
          <span className={cn(
            'rounded-full px-2 py-0.5 text-xs',
            current === filter.id
              ? 'bg-primary-foreground/20 text-primary-foreground'
              : 'bg-background text-foreground'
          )}>
            {counts[filter.id] || 0}
          </span>
        </button>
      ))}
    </div>
  )
}
