import type { NodeType } from '../index'
import type { NodeDefinition, NodeExecuteFunction } from './types'

/**
 * 節點註冊表
 * 管理所有可用的節點類型
 */
export class NodeRegistry {
  private nodes: Map<NodeType, NodeDefinition> = new Map()

  constructor() {
    this.registerBuiltinNodes()
  }

  /**
   * 註冊節點
   */
  register(definition: NodeDefinition): void {
    this.nodes.set(definition.type, definition)
  }

  /**
   * 取得節點定義
   */
  get(type: NodeType): NodeDefinition | undefined {
    return this.nodes.get(type)
  }

  /**
   * 取得所有節點定義
   */
  getAll(): NodeDefinition[] {
    return Array.from(this.nodes.values())
  }

  /**
   * 按類別取得節點
   */
  getByCategory(category: string): NodeDefinition[] {
    return this.getAll().filter((n) => n.category === category)
  }

  /**
   * 執行節點
   */
  async execute(
    type: NodeType,
    input: Record<string, unknown>,
    config: Record<string, unknown>,
    context: Parameters<NodeExecuteFunction>[2]
  ): Promise<Record<string, unknown>> {
    const definition = this.get(type)
    if (!definition) {
      throw new Error(`Unknown node type: ${type}`)
    }

    return definition.execute(input, config, context)
  }

  /**
   * 註冊內建節點
   */
  private registerBuiltinNodes(): void {
    // Trigger: 手動觸發
    this.register({
      type: 'trigger',
      label: '觸發器',
      description: '工作流的起始點',
      icon: '⚡',
      category: 'trigger',
      inputs: [],
      outputs: [{ id: 'output', name: '輸出', type: 'any' }],
      configSchema: {
        properties: {
          triggerType: {
            type: 'select',
            label: '觸發類型',
            options: [
              { label: '手動觸發', value: 'manual' },
              { label: '定時觸發', value: 'scheduled' },
              { label: 'Webhook', value: 'webhook' },
              { label: '事件觸發', value: 'event' },
            ],
            default: 'manual',
          },
        },
      },
      execute: async (input) => {
        return { output: input }
      },
    })

    // Agent: AI 代理
    this.register({
      type: 'agent',
      label: 'AI 代理',
      description: '呼叫 AI 代理處理任務',
      icon: '🤖',
      category: 'agent',
      inputs: [{ id: 'message', name: '訊息', type: 'string', required: true }],
      outputs: [{ id: 'response', name: '回應', type: 'string' }],
      configSchema: {
        properties: {
          agentId: {
            type: 'select',
            label: '選擇代理',
            options: [],
          },
          systemPrompt: {
            type: 'code',
            label: '系統提示',
            placeholder: '輸入系統提示...',
          },
          model: {
            type: 'select',
            label: '模型',
            options: [
              { label: 'Claude 3 Opus', value: 'claude-3-opus' },
              { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet' },
              { label: 'GPT-4o', value: 'gpt-4o' },
            ],
            default: 'claude-3-sonnet',
          },
        },
        required: ['agentId'],
      },
      execute: async (input, config, context) => {
        const message = input.message as string
        const response = await context.callAgent(config.agentId as string, message)
        return { response }
      },
    })

    // Tool: 工具呼叫
    this.register({
      type: 'tool',
      label: '工具',
      description: '呼叫 MCP 工具',
      icon: '🔧',
      category: 'agent',
      inputs: [{ id: 'args', name: '參數', type: 'object' }],
      outputs: [{ id: 'result', name: '結果', type: 'any' }],
      configSchema: {
        properties: {
          toolName: {
            type: 'string',
            label: '工具名稱',
            placeholder: 'server__tool_name',
          },
          argsTemplate: {
            type: 'json',
            label: '參數模板',
            default: {},
          },
        },
        required: ['toolName'],
      },
      execute: async (input, config, context) => {
        const args = { ...(config.argsTemplate as object), ...(input.args as object) }
        const result = await context.callTool(config.toolName as string, args)
        return { result }
      },
    })

    // Condition: 條件分支
    this.register({
      type: 'condition',
      label: '條件',
      description: '根據條件決定流程',
      icon: '🔀',
      category: 'logic',
      inputs: [{ id: 'value', name: '值', type: 'any', required: true }],
      outputs: [
        { id: 'true', name: '是', type: 'any' },
        { id: 'false', name: '否', type: 'any' },
      ],
      configSchema: {
        properties: {
          operator: {
            type: 'select',
            label: '運算符',
            options: [
              { label: '等於', value: 'eq' },
              { label: '不等於', value: 'neq' },
              { label: '大於', value: 'gt' },
              { label: '小於', value: 'lt' },
              { label: '包含', value: 'contains' },
              { label: '為空', value: 'empty' },
              { label: '非空', value: 'notEmpty' },
            ],
          },
          compareValue: {
            type: 'string',
            label: '比較值',
          },
        },
      },
      execute: async (input, config) => {
        const value = input.value
        const compareValue = config.compareValue
        let result = false

        switch (config.operator) {
          case 'eq':
            result = value === compareValue
            break
          case 'neq':
            result = value !== compareValue
            break
          case 'gt':
            result = Number(value) > Number(compareValue)
            break
          case 'lt':
            result = Number(value) < Number(compareValue)
            break
          case 'contains':
            result = String(value).includes(String(compareValue))
            break
          case 'empty':
            result = !value || (Array.isArray(value) && value.length === 0)
            break
          case 'notEmpty':
            result = !!value && (!Array.isArray(value) || value.length > 0)
            break
        }

        return result ? { true: value } : { false: value }
      },
    })

    // Loop: 迴圈
    this.register({
      type: 'loop',
      label: '迴圈',
      description: '遍歷陣列執行操作',
      icon: '🔁',
      category: 'logic',
      inputs: [{ id: 'items', name: '項目', type: 'array', required: true }],
      outputs: [
        { id: 'item', name: '當前項目', type: 'any' },
        { id: 'index', name: '索引', type: 'number' },
        { id: 'completed', name: '完成', type: 'array' },
      ],
      configSchema: {
        properties: {
          maxIterations: {
            type: 'number',
            label: '最大迭代次數',
            default: 100,
          },
        },
      },
      execute: async (input) => {
        // 迴圈節點需要特殊處理，這裡只返回第一個項目
        const items = input.items as unknown[]
        if (items.length === 0) {
          return { completed: [] }
        }
        return { item: items[0], index: 0 }
      },
    })

    // Parallel: 並行執行
    this.register({
      type: 'parallel',
      label: '並行',
      description: '同時執行多個分支',
      icon: '⚡',
      category: 'logic',
      inputs: [{ id: 'input', name: '輸入', type: 'any' }],
      outputs: [
        { id: 'branch1', name: '分支 1', type: 'any' },
        { id: 'branch2', name: '分支 2', type: 'any' },
        { id: 'branch3', name: '分支 3', type: 'any' },
      ],
      configSchema: {
        properties: {
          branchCount: {
            type: 'number',
            label: '分支數量',
            default: 2,
          },
        },
      },
      execute: async (input) => {
        return {
          branch1: input.input,
          branch2: input.input,
          branch3: input.input,
        }
      },
    })

    // Transform: 資料轉換
    this.register({
      type: 'transform',
      label: '轉換',
      description: '轉換資料格式',
      icon: '🔄',
      category: 'data',
      inputs: [{ id: 'data', name: '資料', type: 'any', required: true }],
      outputs: [{ id: 'result', name: '結果', type: 'any' }],
      configSchema: {
        properties: {
          transformType: {
            type: 'select',
            label: '轉換類型',
            options: [
              { label: 'JSON 解析', value: 'parseJson' },
              { label: 'JSON 序列化', value: 'stringify' },
              { label: '提取欄位', value: 'extract' },
              { label: '模板', value: 'template' },
              { label: '自訂程式碼', value: 'code' },
            ],
          },
          expression: {
            type: 'code',
            label: '表達式',
            placeholder: 'data.field 或模板字串',
          },
        },
      },
      execute: async (input, config) => {
        const data = input.data
        let result: unknown = data

        switch (config.transformType) {
          case 'parseJson':
            result = JSON.parse(String(data))
            break
          case 'stringify':
            result = JSON.stringify(data)
            break
          case 'extract':
            // 簡單的欄位提取
            const path = String(config.expression).split('.')
            result = path.reduce((obj: any, key) => obj?.[key], data)
            break
          case 'template':
            // 簡單的模板替換
            result = String(config.expression).replace(
              /\{\{(\w+)\}\}/g,
              (_, key) => String((data as any)?.[key] ?? '')
            )
            break
        }

        return { result }
      },
    })

    // Output: 輸出
    this.register({
      type: 'output',
      label: '輸出',
      description: '工作流的輸出節點',
      icon: '📤',
      category: 'output',
      inputs: [{ id: 'value', name: '值', type: 'any', required: true }],
      outputs: [],
      configSchema: {
        properties: {
          outputName: {
            type: 'string',
            label: '輸出名稱',
            default: 'result',
          },
        },
      },
      execute: async (input, config) => {
        return { [config.outputName as string]: input.value }
      },
    })
  }
}
