'use client'

import { useState } from 'react'
import { Settings, Trash2, Play, Pause, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MCPServer {
  id: string
  name: string
  description: string
  author: string
  category: string
  installed: boolean
}

interface MCPInstalledListProps {
  servers: MCPServer[]
  onUninstall: (id: string) => void
}

export function MCPInstalledList({ servers, onUninstall }: MCPInstalledListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [serverStatus, setServerStatus] = useState<Record<string, 'running' | 'stopped'>>(() => {
    return servers.reduce((acc, s) => ({ ...acc, [s.id]: 'running' }), {})
  })

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const toggleStatus = (id: string) => {
    setServerStatus((prev) => ({
      ...prev,
      [id]: prev[id] === 'running' ? 'stopped' : 'running',
    }))
  }

  if (servers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">還沒有安裝任何工具</p>
        <p className="mt-1 text-sm text-muted-foreground">
          前往市場安裝工具來擴展 AI 的能力
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {servers.map((server) => {
        const isExpanded = expandedId === server.id
        const status = serverStatus[server.id] || 'stopped'

        return (
          <div
            key={server.id}
            className="rounded-lg border bg-card transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleExpand(server.id)}
                  className="text-muted-foreground"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    status === 'running' ? 'bg-green-500' : 'bg-gray-400'
                  )}
                />

                <div>
                  <h3 className="font-medium">{server.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {server.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    status === 'running'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  )}
                >
                  {status === 'running' ? '運行中' : '已停止'}
                </span>

                <button
                  onClick={() => toggleStatus(server.id)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title={status === 'running' ? '停止' : '啟動'}
                >
                  {status === 'running' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>

                <button
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title="設定"
                >
                  <Settings className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onUninstall(server.id)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-red-500"
                  title="卸載"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t px-4 py-3">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium">可用工具</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {getToolsForServer(server.id).map((tool) => (
                        <span
                          key={tool}
                          className="rounded-md bg-muted px-2 py-1 text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">配置</h4>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      {JSON.stringify(
                        {
                          command: 'npx',
                          args: ['-y', `@anthropic/mcp-server-${server.id}`],
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function getToolsForServer(id: string): string[] {
  const toolsMap: Record<string, string[]> = {
    filesystem: ['read_file', 'write_file', 'list_directory', 'search_files', 'get_file_info'],
    github: ['create_issue', 'create_pr', 'list_repos', 'get_file_contents', 'search_code'],
    postgres: ['query', 'list_tables', 'describe_table', 'execute'],
    puppeteer: ['navigate', 'screenshot', 'click', 'type', 'evaluate'],
  }
  return toolsMap[id] || ['tool_1', 'tool_2']
}
