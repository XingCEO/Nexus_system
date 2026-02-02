/**
 * Workflow 模組
 * 實現多 Agent 協作與視覺化工作流編排
 */

// Types
export interface Workflow {
  id: string
  name: string
  description?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  variables: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: NodeData
}

export type NodeType =
  | 'trigger'
  | 'agent'
  | 'tool'
  | 'condition'
  | 'loop'
  | 'parallel'
  | 'transform'
  | 'output'

export interface NodeData {
  label: string
  description?: string
  config: Record<string, unknown>
  inputs?: NodePort[]
  outputs?: NodePort[]
}

export interface NodePort {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any'
  required?: boolean
}

export interface WorkflowEdge {
  id: string
  source: string
  sourceHandle?: string
  target: string
  targetHandle?: string
  label?: string
  condition?: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: Date
  completedAt?: Date
  input: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
  nodeExecutions: NodeExecution[]
}

export interface NodeExecution {
  nodeId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  startedAt?: Date
  completedAt?: Date
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
}

// Core exports
export { WorkflowEngine } from './engine'
export { WorkflowExecutor } from './executors/executor'
export { NodeRegistry } from './nodes/registry'
export * from './nodes/types'
