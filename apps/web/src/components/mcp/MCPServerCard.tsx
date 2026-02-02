'use client'

import { Download, Check, Star, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MCPServer {
  id: string
  name: string
  description: string
  author: string
  category: string
  stars: number
  installed: boolean
}

interface MCPServerCardProps {
  server: MCPServer
  onInstall: () => void
  onUninstall: () => void
}

function BrandLogo({ id, className }: { id: string; className?: string }) {
  const iconClass = cn('w-6 h-6', className)

  switch (id) {
    case 'filesystem':
      // Anthropic style - abstract A
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M12 2L2 19h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M12 8v6M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'github':
      // GitHub Octocat simplified
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      )
    case 'puppeteer':
      // Puppeteer puppet strings
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="2"/>
          <circle cx="10" cy="13" r="1" fill="currentColor"/>
          <circle cx="14" cy="13" r="1" fill="currentColor"/>
          <path d="M10 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M12 8V2M8 10L4 4M16 10l4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'postgres':
      // PostgreSQL elephant
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M19 9c0 4.97-3.13 9-7 9s-7-4.03-7-9 3.13-7 7-7 7 2.03 7 7z" stroke="currentColor" strokeWidth="2"/>
          <path d="M15 9c0 1.1-.9 2-2 2s-2-.9-2-2M9 12c-2 1-3 3-2 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="10" cy="8" r="1" fill="currentColor"/>
          <path d="M17 11c1 1 2 3 1 5l-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'slack':
      // Slack logo
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}>
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z"/>
        </svg>
      )
    case 'notion':
      // Notion logo
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H13l7 7v10.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19.5v-15z" stroke="currentColor" strokeWidth="2"/>
          <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'gmail':
      // Gmail M envelope
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 6v2l10 7 10-7V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'calendar':
      // Google Calendar
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 9h18" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 13h3v3H7zM14 13h3v3h-3z" fill="currentColor"/>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
  }
}

const categoryColors: Record<string, string> = {
  system: 'bg-gradient-to-br from-orange-500 to-orange-600',
  dev: 'bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400',
  database: 'bg-gradient-to-br from-blue-500 to-blue-700',
  automation: 'bg-gradient-to-br from-teal-500 to-teal-600',
  communication: 'bg-gradient-to-br from-purple-500 to-pink-500',
  productivity: 'bg-gradient-to-br from-gray-800 to-black dark:from-gray-100 dark:to-white',
}

const categoryTextColors: Record<string, string> = {
  system: 'text-white',
  dev: 'text-white dark:text-gray-900',
  database: 'text-white',
  automation: 'text-white',
  communication: 'text-white',
  productivity: 'text-white dark:text-gray-900',
}

export function MCPServerCard({ server, onInstall, onUninstall }: MCPServerCardProps) {
  return (
    <div className="group rounded-xl border border-border/50 bg-card/50 p-4 transition-all hover:bg-card hover:border-border hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            categoryColors[server.category] || 'bg-gray-500',
            categoryTextColors[server.category] || 'text-white'
          )}>
            <BrandLogo id={server.id} />
          </div>
          <div>
            <h3 className="font-semibold">{server.name}</h3>
            <p className="text-xs text-muted-foreground">by {server.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{(server.stars / 1000).toFixed(1)}k</span>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
        {server.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          文檔
        </button>

        {server.installed ? (
          <button
            onClick={onUninstall}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:text-green-400 dark:hover:text-red-400"
          >
            <Check className="h-3.5 w-3.5" />
            已安裝
          </button>
        ) : (
          <button
            onClick={onInstall}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" />
            安裝
          </button>
        )}
      </div>
    </div>
  )
}
