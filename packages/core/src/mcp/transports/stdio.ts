import type { MCPServerConfig, MCPTool, MCPResource, MCPPrompt, ToolCallResult } from '../index'

interface JSONRPCRequest {
  jsonrpc: '2.0'
  id: number
  method: string
  params?: unknown
}

interface JSONRPCResponse {
  jsonrpc: '2.0'
  id: number
  result?: unknown
  error?: { code: number; message: string }
}

/**
 * Stdio Transport
 * 透過 stdin/stdout 與 MCP Server 通訊
 */
export class StdioTransport {
  private config: MCPServerConfig
  private process: ChildProcess | null = null
  private requestId = 0
  private pendingRequests: Map<number, {
    resolve: (value: unknown) => void
    reject: (error: Error) => void
  }> = new Map()
  private buffer = ''

  constructor(config: MCPServerConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    // 在 Node.js 環境中使用 child_process
    // 在瀏覽器環境中這個 transport 不可用
    if (typeof window !== 'undefined') {
      throw new Error('StdioTransport is not available in browser environment')
    }

    const { spawn } = await import('child_process')

    this.process = spawn(this.config.command, this.config.args || [], {
      env: { ...process.env, ...this.config.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    this.process.stdout?.on('data', (data: Buffer) => {
      this.handleData(data.toString())
    })

    this.process.stderr?.on('data', (data: Buffer) => {
      console.error(`[MCP ${this.config.name}] stderr:`, data.toString())
    })

    this.process.on('error', (error) => {
      console.error(`[MCP ${this.config.name}] process error:`, error)
    })

    this.process.on('exit', (code) => {
      console.log(`[MCP ${this.config.name}] process exited with code ${code}`)
      this.process = null
    })

    // 初始化握手
    await this.initialize()
  }

  async disconnect(): Promise<void> {
    if (this.process) {
      this.process.kill()
      this.process = null
    }
    this.pendingRequests.clear()
  }

  async listTools(): Promise<Omit<MCPTool, 'serverName'>[]> {
    const result = await this.request('tools/list', {})
    return (result as { tools: Omit<MCPTool, 'serverName'>[] }).tools || []
  }

  async listResources(): Promise<Omit<MCPResource, 'serverName'>[]> {
    const result = await this.request('resources/list', {})
    return (result as { resources: Omit<MCPResource, 'serverName'>[] }).resources || []
  }

  async listPrompts(): Promise<Omit<MCPPrompt, 'serverName'>[]> {
    const result = await this.request('prompts/list', {})
    return (result as { prompts: Omit<MCPPrompt, 'serverName'>[] }).prompts || []
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<ToolCallResult> {
    const result = await this.request('tools/call', { name, arguments: args })
    return result as ToolCallResult
  }

  async readResource(uri: string): Promise<string> {
    const result = await this.request('resources/read', { uri })
    const contents = (result as { contents: Array<{ text?: string }> }).contents
    return contents?.[0]?.text || ''
  }

  async getPrompt(name: string, args?: Record<string, string>): Promise<string> {
    const result = await this.request('prompts/get', { name, arguments: args })
    const messages = (result as { messages: Array<{ content: { text: string } }> }).messages
    return messages?.map((m) => m.content.text).join('\n') || ''
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

    // 發送 initialized 通知
    this.notify('notifications/initialized', {})
  }

  private async request(method: string, params: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId

      this.pendingRequests.set(id, { resolve, reject })

      const request: JSONRPCRequest = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      }

      this.send(request)

      // 超時處理
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id)
          reject(new Error(`Request timeout: ${method}`))
        }
      }, 30000)
    })
  }

  private notify(method: string, params: unknown): void {
    const notification = {
      jsonrpc: '2.0',
      method,
      params,
    }
    this.send(notification)
  }

  private send(message: unknown): void {
    if (!this.process?.stdin) {
      throw new Error('Process not connected')
    }

    const json = JSON.stringify(message)
    const content = `Content-Length: ${Buffer.byteLength(json)}\r\n\r\n${json}`
    this.process.stdin.write(content)
  }

  private handleData(data: string): void {
    this.buffer += data

    while (true) {
      const headerEnd = this.buffer.indexOf('\r\n\r\n')
      if (headerEnd === -1) break

      const header = this.buffer.slice(0, headerEnd)
      const match = header.match(/Content-Length: (\d+)/)
      if (!match) break

      const contentLength = parseInt(match[1], 10)
      const messageStart = headerEnd + 4
      const messageEnd = messageStart + contentLength

      if (this.buffer.length < messageEnd) break

      const message = this.buffer.slice(messageStart, messageEnd)
      this.buffer = this.buffer.slice(messageEnd)

      try {
        const response = JSON.parse(message) as JSONRPCResponse
        this.handleResponse(response)
      } catch (error) {
        console.error('Failed to parse MCP response:', error)
      }
    }
  }

  private handleResponse(response: JSONRPCResponse): void {
    const pending = this.pendingRequests.get(response.id)
    if (!pending) return

    this.pendingRequests.delete(response.id)

    if (response.error) {
      pending.reject(new Error(response.error.message))
    } else {
      pending.resolve(response.result)
    }
  }
}

// Type stub for child_process
interface ChildProcess {
  stdin: { write: (data: string) => void } | null
  stdout: { on: (event: string, callback: (data: Buffer) => void) => void } | null
  stderr: { on: (event: string, callback: (data: Buffer) => void) => void } | null
  on: (event: string, callback: (...args: unknown[]) => void) => void
  kill: () => void
}
