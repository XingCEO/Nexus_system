import type {
  MCPServerConfig,
  MCPTool,
  MCPResource,
  MCPPrompt,
  ToolCallResult,
} from './index'
import { MCPServerManager } from './manager'

export interface MCPClientConfig {
  servers: MCPServerConfig[]
  onToolCall?: (serverName: string, toolName: string, args: unknown) => void
  onError?: (error: Error, serverName?: string) => void
}

/**
 * MCP 客戶端
 * 管理與多個 MCP Server 的連接
 */
export class MCPClient {
  private manager: MCPServerManager
  private config: MCPClientConfig
  private initialized = false

  constructor(config: MCPClientConfig) {
    this.config = config
    this.manager = new MCPServerManager()
  }

  /**
   * 初始化並連接所有 Server
   */
  async connect(): Promise<void> {
    if (this.initialized) return

    const enabledServers = this.config.servers.filter((s) => s.enabled !== false)

    for (const server of enabledServers) {
      try {
        await this.manager.addServer(server)
      } catch (error) {
        this.config.onError?.(error as Error, server.name)
      }
    }

    this.initialized = true
  }

  /**
   * 斷開所有連接
   */
  async disconnect(): Promise<void> {
    await this.manager.removeAllServers()
    this.initialized = false
  }

  /**
   * 取得所有可用工具
   */
  async listTools(): Promise<MCPTool[]> {
    return this.manager.listAllTools()
  }

  /**
   * 取得所有可用資源
   */
  async listResources(): Promise<MCPResource[]> {
    return this.manager.listAllResources()
  }

  /**
   * 取得所有可用提示模板
   */
  async listPrompts(): Promise<MCPPrompt[]> {
    return this.manager.listAllPrompts()
  }

  /**
   * 呼叫工具
   */
  async callTool(name: string, args: Record<string, unknown>): Promise<ToolCallResult> {
    const [serverName, toolName] = this.parseToolName(name)

    this.config.onToolCall?.(serverName, toolName, args)

    try {
      return await this.manager.callTool(serverName, toolName, args)
    } catch (error) {
      this.config.onError?.(error as Error, serverName)
      return {
        content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
        isError: true,
      }
    }
  }

  /**
   * 讀取資源
   */
  async readResource(uri: string): Promise<string> {
    return this.manager.readResource(uri)
  }

  /**
   * 取得提示模板
   */
  async getPrompt(name: string, args?: Record<string, string>): Promise<string> {
    const [serverName, promptName] = this.parseToolName(name)
    return this.manager.getPrompt(serverName, promptName, args)
  }

  /**
   * 取得已連接的 Server 列表
   */
  getConnectedServers(): string[] {
    return this.manager.getServerNames()
  }

  /**
   * 動態添加 Server
   */
  async addServer(config: MCPServerConfig): Promise<void> {
    await this.manager.addServer(config)
  }

  /**
   * 動態移除 Server
   */
  async removeServer(name: string): Promise<void> {
    await this.manager.removeServer(name)
  }

  /**
   * 將工具轉換為 LLM 可用的格式
   */
  async getToolsForLLM(): Promise<LLMTool[]> {
    const tools = await this.listTools()

    return tools.map((tool) => ({
      name: `${tool.serverName}__${tool.name}`,
      description: tool.description,
      input_schema: tool.inputSchema,
    }))
  }

  private parseToolName(name: string): [string, string] {
    const parts = name.split('__')
    if (parts.length === 2) {
      return [parts[0], parts[1]]
    }
    // 如果沒有前綴，嘗試在所有 server 中找
    return ['', name]
  }
}

interface LLMTool {
  name: string
  description: string
  input_schema: unknown
}
