import type { MCPTool, MCPResource, MCPPrompt, ToolCallResult } from '../index'

/**
 * SSE Transport
 * 透過 Server-Sent Events 與遠端 MCP Server 通訊
 * 適用於瀏覽器環境
 */
export class SSETransport {
  private baseUrl: string
  private eventSource: EventSource | null = null
  private sessionId: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  async connect(): Promise<void> {
    // 建立 SSE 連接
    const response = await fetch(`${this.baseUrl}/sse`, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to connect: ${response.statusText}`)
    }

    // 從 response 獲取 session ID
    this.sessionId = response.headers.get('x-session-id') || crypto.randomUUID()

    // 初始化
    await this.initialize()
  }

  async disconnect(): Promise<void> {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
    this.sessionId = null
  }

  async listTools(): Promise<Omit<MCPTool, 'serverName'>[]> {
    const result = await this.request('tools/list', {})
    return result.tools || []
  }

  async listResources(): Promise<Omit<MCPResource, 'serverName'>[]> {
    const result = await this.request('resources/list', {})
    return result.resources || []
  }

  async listPrompts(): Promise<Omit<MCPPrompt, 'serverName'>[]> {
    const result = await this.request('prompts/list', {})
    return result.prompts || []
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<ToolCallResult> {
    return this.request('tools/call', { name, arguments: args })
  }

  async readResource(uri: string): Promise<string> {
    const result = await this.request('resources/read', { uri })
    return result.contents?.[0]?.text || ''
  }

  async getPrompt(name: string, args?: Record<string, string>): Promise<string> {
    const result = await this.request('prompts/get', { name, arguments: args })
    return result.messages?.map((m: { content: { text: string } }) => m.content.text).join('\n') || ''
  }

  private async initialize(): Promise<void> {
    await this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: '超級系統',
        version: '0.4.0',
      },
    })
  }

  private async request(method: string, params: unknown): Promise<any> {
    const response = await fetch(`${this.baseUrl}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.sessionId && { 'x-session-id': this.sessionId }),
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      }),
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`)
    }

    const result = await response.json()

    if (result.error) {
      throw new Error(result.error.message)
    }

    return result.result
  }
}
