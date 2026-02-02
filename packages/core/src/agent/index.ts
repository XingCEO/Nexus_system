import type { Agent, Message } from '@super/shared/types'
import { generateId } from '@super/shared/utils'
import { MemoryManager } from '../memory'

export interface LLMProvider {
  chat(messages: Message[], options?: ChatOptions): Promise<string>
  stream(messages: Message[], options?: ChatOptions): AsyncIterable<string>
}

export interface ChatOptions {
  temperature?: number
  maxTokens?: number
  tools?: Tool[]
}

export interface Tool {
  name: string
  description: string
  parameters: Record<string, unknown>
  execute: (params: Record<string, unknown>) => Promise<unknown>
}

export interface AgentRuntimeConfig {
  agent: Agent
  llm: LLMProvider
  memory?: MemoryManager
  tools?: Tool[]
}

export class AgentRuntime {
  private agent: Agent
  private llm: LLMProvider
  private memory?: MemoryManager
  private tools: Tool[]
  private conversationHistory: Message[] = []

  constructor(config: AgentRuntimeConfig) {
    this.agent = config.agent
    this.llm = config.llm
    this.memory = config.memory
    this.tools = config.tools ?? []
  }

  async chat(userMessage: string): Promise<string> {
    // 加入用戶訊息
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: userMessage,
      agentId: this.agent.id,
      createdAt: new Date(),
    }
    this.conversationHistory.push(userMsg)

    // 取得記憶上下文
    let memoryContext = ''
    if (this.memory) {
      memoryContext = await this.memory.buildContext(this.agent.id)
    }

    // 構建系統提示
    const systemMessage: Message = {
      id: generateId(),
      role: 'system',
      content: this.buildSystemPrompt(memoryContext),
      createdAt: new Date(),
    }

    // 呼叫 LLM
    const messages = [systemMessage, ...this.conversationHistory]
    const response = await this.llm.chat(messages, {
      tools: this.tools,
    })

    // 儲存助手回應
    const assistantMsg: Message = {
      id: generateId(),
      role: 'assistant',
      content: response,
      agentId: this.agent.id,
      createdAt: new Date(),
    }
    this.conversationHistory.push(assistantMsg)

    // 自動提取記憶
    if (this.memory) {
      await this.extractAndSaveMemory(userMessage, response)
    }

    return response
  }

  async *stream(userMessage: string): AsyncIterable<string> {
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: userMessage,
      agentId: this.agent.id,
      createdAt: new Date(),
    }
    this.conversationHistory.push(userMsg)

    let memoryContext = ''
    if (this.memory) {
      memoryContext = await this.memory.buildContext(this.agent.id)
    }

    const systemMessage: Message = {
      id: generateId(),
      role: 'system',
      content: this.buildSystemPrompt(memoryContext),
      createdAt: new Date(),
    }

    const messages = [systemMessage, ...this.conversationHistory]
    let fullResponse = ''

    for await (const chunk of this.llm.stream(messages)) {
      fullResponse += chunk
      yield chunk
    }

    const assistantMsg: Message = {
      id: generateId(),
      role: 'assistant',
      content: fullResponse,
      agentId: this.agent.id,
      createdAt: new Date(),
    }
    this.conversationHistory.push(assistantMsg)
  }

  private buildSystemPrompt(memoryContext: string): string {
    let prompt = this.agent.systemPrompt ?? '你是一個有幫助的 AI 助手。'

    if (memoryContext) {
      prompt += '\n\n' + memoryContext
    }

    return prompt
  }

  private async extractAndSaveMemory(
    _userMessage: string,
    _response: string
  ): Promise<void> {
    // TODO: 實作智慧記憶提取
    // 這裡可以用 LLM 分析對話，自動提取重要資訊
  }

  clearHistory(): void {
    this.conversationHistory = []
  }

  getHistory(): Message[] {
    return [...this.conversationHistory]
  }
}
