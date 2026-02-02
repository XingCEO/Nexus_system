import type {
  MCPServerConfig,
  MCPTool,
  MCPResource,
  MCPPrompt,
  ToolCallResult,
} from './index'
import { StdioTransport } from './transports/stdio'

interface ServerConnection {
  config: MCPServerConfig
  transport: StdioTransport
  tools: MCPTool[]
  resources: MCPResource[]
  prompts: MCPPrompt[]
}

/**
 * MCP Server 管理器
 * 負責管理多個 Server 連接
 */
export class MCPServerManager {
  private servers: Map<string, ServerConnection> = new Map()

  /**
   * 添加並連接 Server
   */
  async addServer(config: MCPServerConfig): Promise<void> {
    if (this.servers.has(config.name)) {
      throw new Error(`Server already exists: ${config.name}`)
    }

    const transport = new StdioTransport(config)
    await transport.connect()

    // 初始化時獲取 capabilities
    const [tools, resources, prompts] = await Promise.all([
      transport.listTools(),
      transport.listResources(),
      transport.listPrompts(),
    ])

    this.servers.set(config.name, {
      config,
      transport,
      tools: tools.map((t) => ({ ...t, serverName: config.name })),
      resources: resources.map((r) => ({ ...r, serverName: config.name })),
      prompts: prompts.map((p) => ({ ...p, serverName: config.name })),
    })
  }

  /**
   * 移除 Server
   */
  async removeServer(name: string): Promise<void> {
    const server = this.servers.get(name)
    if (server) {
      await server.transport.disconnect()
      this.servers.delete(name)
    }
  }

  /**
   * 移除所有 Server
   */
  async removeAllServers(): Promise<void> {
    for (const [name] of this.servers) {
      await this.removeServer(name)
    }
  }

  /**
   * 取得所有 Server 名稱
   */
  getServerNames(): string[] {
    return Array.from(this.servers.keys())
  }

  /**
   * 列出所有工具
   */
  async listAllTools(): Promise<MCPTool[]> {
    const tools: MCPTool[] = []
    for (const server of this.servers.values()) {
      tools.push(...server.tools)
    }
    return tools
  }

  /**
   * 列出所有資源
   */
  async listAllResources(): Promise<MCPResource[]> {
    const resources: MCPResource[] = []
    for (const server of this.servers.values()) {
      resources.push(...server.resources)
    }
    return resources
  }

  /**
   * 列出所有提示模板
   */
  async listAllPrompts(): Promise<MCPPrompt[]> {
    const prompts: MCPPrompt[] = []
    for (const server of this.servers.values()) {
      prompts.push(...server.prompts)
    }
    return prompts
  }

  /**
   * 呼叫工具
   */
  async callTool(
    serverName: string,
    toolName: string,
    args: Record<string, unknown>
  ): Promise<ToolCallResult> {
    // 如果沒指定 server，在所有 server 中找
    if (!serverName) {
      for (const [name, server] of this.servers) {
        if (server.tools.some((t) => t.name === toolName)) {
          serverName = name
          break
        }
      }
    }

    const server = this.servers.get(serverName)
    if (!server) {
      throw new Error(`Server not found: ${serverName}`)
    }

    return server.transport.callTool(toolName, args)
  }

  /**
   * 讀取資源
   */
  async readResource(uri: string): Promise<string> {
    for (const server of this.servers.values()) {
      if (server.resources.some((r) => r.uri === uri)) {
        return server.transport.readResource(uri)
      }
    }
    throw new Error(`Resource not found: ${uri}`)
  }

  /**
   * 取得提示模板
   */
  async getPrompt(
    serverName: string,
    promptName: string,
    args?: Record<string, string>
  ): Promise<string> {
    const server = this.servers.get(serverName)
    if (!server) {
      throw new Error(`Server not found: ${serverName}`)
    }

    return server.transport.getPrompt(promptName, args)
  }

  /**
   * 刷新 Server 的 capabilities
   */
  async refreshServer(name: string): Promise<void> {
    const server = this.servers.get(name)
    if (!server) return

    const [tools, resources, prompts] = await Promise.all([
      server.transport.listTools(),
      server.transport.listResources(),
      server.transport.listPrompts(),
    ])

    server.tools = tools.map((t) => ({ ...t, serverName: name }))
    server.resources = resources.map((r) => ({ ...r, serverName: name }))
    server.prompts = prompts.map((p) => ({ ...p, serverName: name }))
  }
}
