import type { Workflow, WorkflowNode, WorkflowEdge, WorkflowExecution } from '../index'
import { NodeRegistry } from '../nodes/registry'
import type { NodeExecutionContext } from '../nodes/types'

interface ExecutorConfig {
  maxConcurrency: number
  timeout: number
}

interface ExecutorCallbacks {
  onNodeStart: (nodeId: string) => void
  onNodeComplete: (nodeId: string, output: Record<string, unknown>) => void
  onNodeError: (nodeId: string, error: Error) => void
}

interface ExecutionGraph {
  nodes: Map<string, {
    node: WorkflowNode
    dependencies: string[]
    dependents: string[]
  }>
  edges: Map<string, WorkflowEdge>
}

/**
 * 工作流執行器
 * 負責實際執行工作流節點
 */
export class WorkflowExecutor {
  private registry: NodeRegistry
  private config: ExecutorConfig
  private activeExecutions: Map<string, AbortController> = new Map()

  constructor(registry: NodeRegistry, config: ExecutorConfig) {
    this.registry = registry
    this.config = config
  }

  async execute(
    workflow: Workflow,
    graph: ExecutionGraph,
    input: Record<string, unknown>,
    execution: WorkflowExecution,
    callbacks: ExecutorCallbacks
  ): Promise<Record<string, unknown>> {
    const abortController = new AbortController()
    this.activeExecutions.set(execution.id, abortController)

    const nodeOutputs: Map<string, Record<string, unknown>> = new Map()
    const completedNodes: Set<string> = new Set()
    const runningNodes: Set<string> = new Set()

    // 初始化變數
    const variables: Record<string, unknown> = { ...workflow.variables, ...input }

    // 建立執行上下文
    const createContext = (nodeId: string): NodeExecutionContext => ({
      nodeId,
      workflowId: workflow.id,
      executionId: execution.id,
      variables,
      callAgent: async (agentId: string, message: string) => {
        // TODO: 整合 AgentRuntime
        return `Agent ${agentId} response to: ${message}`
      },
      callTool: async (toolName: string, args: Record<string, unknown>) => {
        // TODO: 整合 MCPClient
        return { result: `Tool ${toolName} called with ${JSON.stringify(args)}` }
      },
      log: (message: string) => {
        console.log(`[Workflow ${workflow.id}] [Node ${nodeId}] ${message}`)
      },
    })

    // 找出可以執行的節點（所有依賴都已完成）
    const getReadyNodes = (): WorkflowNode[] => {
      const ready: WorkflowNode[] = []

      for (const [nodeId, nodeInfo] of graph.nodes) {
        if (completedNodes.has(nodeId) || runningNodes.has(nodeId)) continue

        const allDependenciesMet = nodeInfo.dependencies.every((depId) =>
          completedNodes.has(depId)
        )

        if (allDependenciesMet) {
          ready.push(nodeInfo.node)
        }
      }

      return ready
    }

    // 收集節點輸入
    const collectNodeInput = (node: WorkflowNode): Record<string, unknown> => {
      const nodeInfo = graph.nodes.get(node.id)
      if (!nodeInfo) return {}

      const nodeInput: Record<string, unknown> = {}

      // 從依賴節點收集輸出
      for (const depId of nodeInfo.dependencies) {
        const depOutput = nodeOutputs.get(depId)
        if (depOutput) {
          // 找到連接這兩個節點的邊
          for (const edge of graph.edges.values()) {
            if (edge.source === depId && edge.target === node.id) {
              const sourceHandle = edge.sourceHandle || 'output'
              const targetHandle = edge.targetHandle || 'input'
              nodeInput[targetHandle] = depOutput[sourceHandle]
            }
          }
        }
      }

      // 對於觸發器節點，使用初始輸入
      if (node.type === 'trigger') {
        Object.assign(nodeInput, input)
      }

      return nodeInput
    }

    // 執行單個節點
    const executeNode = async (node: WorkflowNode): Promise<void> => {
      if (abortController.signal.aborted) {
        throw new Error('Execution cancelled')
      }

      runningNodes.add(node.id)
      callbacks.onNodeStart(node.id)

      try {
        const nodeInput = collectNodeInput(node)
        const context = createContext(node.id)

        const output = await Promise.race([
          this.registry.execute(node.type, nodeInput, node.data.config, context),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Node execution timeout')), this.config.timeout)
          }),
        ])

        nodeOutputs.set(node.id, output)
        completedNodes.add(node.id)
        runningNodes.delete(node.id)
        callbacks.onNodeComplete(node.id, output)

      } catch (error) {
        runningNodes.delete(node.id)
        callbacks.onNodeError(node.id, error as Error)
        throw error
      }
    }

    // 主執行迴圈
    while (completedNodes.size < graph.nodes.size) {
      if (abortController.signal.aborted) {
        throw new Error('Execution cancelled')
      }

      const readyNodes = getReadyNodes()

      if (readyNodes.length === 0 && runningNodes.size === 0) {
        // 沒有可執行的節點且沒有正在執行的節點，可能有問題
        break
      }

      // 並行執行準備好的節點（受 maxConcurrency 限制）
      const nodesToRun = readyNodes.slice(0, this.config.maxConcurrency - runningNodes.size)

      await Promise.all(nodesToRun.map(executeNode))
    }

    this.activeExecutions.delete(execution.id)

    // 收集最終輸出（從 output 類型節點）
    const finalOutput: Record<string, unknown> = {}
    for (const [nodeId, output] of nodeOutputs) {
      const node = graph.nodes.get(nodeId)?.node
      if (node?.type === 'output') {
        Object.assign(finalOutput, output)
      }
    }

    return finalOutput
  }

  async cancel(executionId: string): Promise<void> {
    const controller = this.activeExecutions.get(executionId)
    if (controller) {
      controller.abort()
      this.activeExecutions.delete(executionId)
    }
  }
}
