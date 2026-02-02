import type {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  WorkflowExecution,
  NodeExecution,
} from './index'
import { WorkflowExecutor } from './executors/executor'
import { NodeRegistry } from './nodes/registry'

export interface WorkflowEngineConfig {
  nodeRegistry: NodeRegistry
  maxConcurrency?: number
  timeout?: number
  onNodeStart?: (nodeId: string, execution: WorkflowExecution) => void
  onNodeComplete?: (nodeId: string, execution: WorkflowExecution) => void
  onNodeError?: (nodeId: string, error: Error, execution: WorkflowExecution) => void
}

/**
 * 工作流引擎
 * 負責工作流的執行與狀態管理
 */
export class WorkflowEngine {
  private config: WorkflowEngineConfig
  private executor: WorkflowExecutor
  private executions: Map<string, WorkflowExecution> = new Map()

  constructor(config: WorkflowEngineConfig) {
    this.config = config
    this.executor = new WorkflowExecutor(config.nodeRegistry, {
      maxConcurrency: config.maxConcurrency ?? 5,
      timeout: config.timeout ?? 300000, // 5 minutes
    })
  }

  /**
   * 執行工作流
   */
  async execute(
    workflow: Workflow,
    input: Record<string, unknown> = {}
  ): Promise<WorkflowExecution> {
    const executionId = crypto.randomUUID()

    const execution: WorkflowExecution = {
      id: executionId,
      workflowId: workflow.id,
      status: 'pending',
      startedAt: new Date(),
      input,
      nodeExecutions: workflow.nodes.map((node) => ({
        nodeId: node.id,
        status: 'pending',
      })),
    }

    this.executions.set(executionId, execution)

    try {
      execution.status = 'running'

      // 建立執行圖
      const graph = this.buildExecutionGraph(workflow)

      // 找到起始節點（Trigger）
      const startNodes = workflow.nodes.filter((n) => n.type === 'trigger')

      if (startNodes.length === 0) {
        throw new Error('Workflow must have at least one trigger node')
      }

      // 執行工作流
      const result = await this.executor.execute(
        workflow,
        graph,
        input,
        execution,
        {
          onNodeStart: (nodeId) => {
            this.updateNodeExecution(execution, nodeId, { status: 'running', startedAt: new Date() })
            this.config.onNodeStart?.(nodeId, execution)
          },
          onNodeComplete: (nodeId, output) => {
            this.updateNodeExecution(execution, nodeId, {
              status: 'completed',
              completedAt: new Date(),
              output,
            })
            this.config.onNodeComplete?.(nodeId, execution)
          },
          onNodeError: (nodeId, error) => {
            this.updateNodeExecution(execution, nodeId, {
              status: 'failed',
              completedAt: new Date(),
              error: error.message,
            })
            this.config.onNodeError?.(nodeId, error, execution)
          },
        }
      )

      execution.status = 'completed'
      execution.completedAt = new Date()
      execution.output = result

    } catch (error) {
      execution.status = 'failed'
      execution.completedAt = new Date()
      execution.error = (error as Error).message
    }

    return execution
  }

  /**
   * 取消執行
   */
  async cancel(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId)
    if (!execution) return

    execution.status = 'cancelled'
    execution.completedAt = new Date()
    await this.executor.cancel(executionId)
  }

  /**
   * 取得執行狀態
   */
  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId)
  }

  /**
   * 驗證工作流
   */
  validate(workflow: Workflow): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // 檢查是否有 Trigger
    const triggers = workflow.nodes.filter((n) => n.type === 'trigger')
    if (triggers.length === 0) {
      errors.push('工作流必須包含至少一個觸發器節點')
    }

    // 檢查是否有孤立節點
    const connectedNodes = new Set<string>()
    for (const edge of workflow.edges) {
      connectedNodes.add(edge.source)
      connectedNodes.add(edge.target)
    }

    for (const node of workflow.nodes) {
      if (node.type !== 'trigger' && !connectedNodes.has(node.id)) {
        warnings.push(`節點 "${node.data.label}" 沒有連接`)
      }
    }

    // 檢查循環依賴
    if (this.hasCycle(workflow)) {
      errors.push('工作流包含循環依賴')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  private buildExecutionGraph(workflow: Workflow): ExecutionGraph {
    const graph: ExecutionGraph = {
      nodes: new Map(),
      edges: new Map(),
    }

    for (const node of workflow.nodes) {
      graph.nodes.set(node.id, {
        node,
        dependencies: [],
        dependents: [],
      })
    }

    for (const edge of workflow.edges) {
      const sourceNode = graph.nodes.get(edge.source)
      const targetNode = graph.nodes.get(edge.target)

      if (sourceNode && targetNode) {
        sourceNode.dependents.push(edge.target)
        targetNode.dependencies.push(edge.source)
      }

      graph.edges.set(edge.id, edge)
    }

    return graph
  }

  private hasCycle(workflow: Workflow): boolean {
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const adjacency = new Map<string, string[]>()
    for (const node of workflow.nodes) {
      adjacency.set(node.id, [])
    }
    for (const edge of workflow.edges) {
      adjacency.get(edge.source)?.push(edge.target)
    }

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId)
      recursionStack.add(nodeId)

      for (const neighbor of adjacency.get(nodeId) || []) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true
        } else if (recursionStack.has(neighbor)) {
          return true
        }
      }

      recursionStack.delete(nodeId)
      return false
    }

    for (const node of workflow.nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true
      }
    }

    return false
  }

  private updateNodeExecution(
    execution: WorkflowExecution,
    nodeId: string,
    update: Partial<NodeExecution>
  ): void {
    const nodeExec = execution.nodeExecutions.find((n) => n.nodeId === nodeId)
    if (nodeExec) {
      Object.assign(nodeExec, update)
    }
  }
}

interface ExecutionGraph {
  nodes: Map<string, {
    node: WorkflowNode
    dependencies: string[]
    dependents: string[]
  }>
  edges: Map<string, WorkflowEdge>
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}
