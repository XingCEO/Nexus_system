/**
 * MCP (Model Context Protocol) 模組
 * 實現 AI 與外部工具/資源的標準化連接
 */

// Types
export interface MCPServerConfig {
  name: string
  description?: string
  command: string
  args?: string[]
  env?: Record<string, string>
  enabled?: boolean
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: JSONSchema
  serverName: string
}

export interface MCPResource {
  uri: string
  name: string
  description?: string
  mimeType?: string
  serverName: string
}

export interface MCPPrompt {
  name: string
  description?: string
  arguments?: MCPPromptArgument[]
  serverName: string
}

export interface MCPPromptArgument {
  name: string
  description?: string
  required?: boolean
}

export interface JSONSchema {
  type: string
  properties?: Record<string, JSONSchema>
  required?: string[]
  description?: string
  [key: string]: unknown
}

export interface ToolCallResult {
  content: Array<{
    type: 'text' | 'image' | 'resource'
    text?: string
    data?: string
    mimeType?: string
  }>
  isError?: boolean
}

// Core exports
export { MCPClient, type MCPClientConfig } from './client'
export { MCPServerManager } from './manager'
export { StdioTransport } from './transports/stdio'
export { SSETransport } from './transports/sse'
