'use client'

import { useState, useCallback } from 'react'
import { WorkflowCanvas } from './WorkflowCanvas'
import { WorkflowSidebar } from './WorkflowSidebar'
import { WorkflowNodePanel } from './WorkflowNodePanel'
import { UpgradePrompt } from '@/components/UpgradePrompt'
import { useUser } from '@/components/AuthGuard'
import { checkWorkflowLimit, addWorkflow, removeWorkflow, LimitCheckResult } from '@/lib/usage'

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    config: Record<string, unknown>
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export function WorkflowEditor() {
  const { user } = useUser()
  const [limitError, setLimitError] = useState<LimitCheckResult | null>(null)
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 100, y: 200 },
      data: { label: '觸發器', config: { triggerType: 'manual' } },
    },
  ])
  const [edges, setEdges] = useState<WorkflowEdge[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)

  const handleAddNode = useCallback((type: string, label: string, position?: { x: number; y: number }) => {
    // 檢查工作流限制（只有 trigger 類型節點算作一個工作流）
    if (type === 'trigger') {
      const limitCheck = checkWorkflowLimit(user)
      if (!limitCheck.allowed) {
        setLimitError(limitCheck)
        return
      }
    }

    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: position || { x: 300, y: 200 },
      data: { label, config: {} },
    }
    setNodes((prev) => [...prev, newNode])

    // 如果是 trigger，記錄到用量
    if (type === 'trigger') {
      addWorkflow(newNode.id)
    }
  }, [user])

  const handleNodeSelect = useCallback((node: WorkflowNode | null) => {
    setSelectedNode(node)
  }, [])

  const handleNodeUpdate = useCallback((id: string, data: Partial<WorkflowNode['data']>) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    )
    if (selectedNode?.id === id) {
      setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, ...data } } : null)
    }
  }, [selectedNode])

  const handleNodeDelete = useCallback((id: string) => {
    const nodeToDelete = nodes.find(n => n.id === id)
    setNodes((prev) => prev.filter((node) => node.id !== id))
    setEdges((prev) => prev.filter((edge) => edge.source !== id && edge.target !== id))
    if (selectedNode?.id === id) {
      setSelectedNode(null)
    }
    // 如果刪除的是 trigger，從用量中移除
    if (nodeToDelete?.type === 'trigger') {
      removeWorkflow(id)
    }
  }, [selectedNode, nodes])

  const handleConnect = useCallback((source: string, target: string) => {
    const newEdge: WorkflowEdge = {
      id: `e-${source}-${target}`,
      source,
      target,
    }
    setEdges((prev) => [...prev, newEdge])
  }, [])

  const handleNodeMove = useCallback((id: string, position: { x: number; y: number }) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, position } : node))
    )
  }, [])

  return (
    <div className="flex h-full">
      {/* 左側：節點面板 */}
      <WorkflowSidebar onAddNode={handleAddNode} />

      {/* 中間：畫布 */}
      <div className="flex-1">
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNode?.id}
          onNodeSelect={handleNodeSelect}
          onNodeMove={handleNodeMove}
          onConnect={handleConnect}
          onNodeDelete={handleNodeDelete}
          onAddNode={handleAddNode}
        />
      </div>

      {/* 右側：節點配置 */}
      {selectedNode && (
        <WorkflowNodePanel
          node={selectedNode}
          onUpdate={(data) => handleNodeUpdate(selectedNode.id, data)}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Upgrade Prompt Modal */}
      {limitError && !limitError.allowed && user && (
        <UpgradePrompt
          limitResult={limitError}
          type="workflows"
          currentTier={user.tier}
          onClose={() => setLimitError(null)}
        />
      )}
    </div>
  )
}
