import type { NodeType } from '../index'

/**
 * 節點定義
 */
export interface NodeDefinition {
  type: NodeType
  label: string
  description: string
  icon: string
  category: NodeCategory
  inputs: NodePortDefinition[]
  outputs: NodePortDefinition[]
  configSchema: ConfigSchema
  execute: NodeExecuteFunction
}

export type NodeCategory = 'trigger' | 'agent' | 'logic' | 'data' | 'output'

export interface NodePortDefinition {
  id: string
  name: string
  type: PortType
  required?: boolean
  default?: unknown
}

export type PortType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any'

export interface ConfigSchema {
  properties: Record<string, ConfigProperty>
  required?: string[]
}

export interface ConfigProperty {
  type: 'string' | 'number' | 'boolean' | 'select' | 'code' | 'json'
  label: string
  description?: string
  default?: unknown
  options?: Array<{ label: string; value: unknown }>
  placeholder?: string
}

export type NodeExecuteFunction = (
  input: Record<string, unknown>,
  config: Record<string, unknown>,
  context: NodeExecutionContext
) => Promise<Record<string, unknown>>

export interface NodeExecutionContext {
  nodeId: string
  workflowId: string
  executionId: string
  variables: Record<string, unknown>
  callAgent: (agentId: string, message: string) => Promise<string>
  callTool: (toolName: string, args: Record<string, unknown>) => Promise<unknown>
  log: (message: string) => void
}
