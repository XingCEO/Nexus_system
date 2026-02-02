'use client'

import { useRef, useState, useCallback } from 'react'
import { WorkflowNodeComponent } from './WorkflowNode'
import type { WorkflowNode, WorkflowEdge } from './WorkflowEditor'

interface WorkflowCanvasProps {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId?: string
  onNodeSelect: (node: WorkflowNode | null) => void
  onNodeMove: (id: string, position: { x: number; y: number }) => void
  onConnect: (source: string, target: string) => void
  onNodeDelete: (id: string) => void
  onAddNode: (type: string, label: string, position: { x: number; y: number }) => void
}

export function WorkflowCanvas({
  nodes,
  edges,
  selectedNodeId,
  onNodeSelect,
  onNodeMove,
  onConnect,
  onNodeDelete,
  onAddNode,
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onNodeSelect(null)
    }
  }

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setScale((prev) => Math.min(Math.max(prev * delta, 0.25), 2))
    } else {
      setPanOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }))
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    if (!data) return

    try {
      const nodeType = JSON.parse(data)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left - panOffset.x) / scale
      const y = (e.clientY - rect.top - panOffset.y) / scale

      onAddNode(nodeType.type, nodeType.label, { x, y })
    } catch {
      // 忽略解析錯誤
    }
  }, [panOffset, scale, onAddNode])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleStartConnect = (nodeId: string) => {
    setConnectingFrom(nodeId)
  }

  const handleEndConnect = (nodeId: string) => {
    if (connectingFrom && connectingFrom !== nodeId) {
      onConnect(connectingFrom, nodeId)
    }
    setConnectingFrom(null)
  }

  return (
    <div
      ref={canvasRef}
      className="relative h-full w-full overflow-hidden bg-[#fafafa] dark:bg-[#1a1a1a]"
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: `${24 * scale}px ${24 * scale}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
      }}
    >
      {/* 縮放指示器 */}
      <div className="absolute bottom-4 left-4 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur">
        {Math.round(scale * 100)}%
      </div>

      {/* 節點層 */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* 連線 */}
        <svg className="absolute inset-0 h-full w-full overflow-visible pointer-events-none">
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source)
            const targetNode = nodes.find((n) => n.id === edge.target)
            if (!sourceNode || !targetNode) return null

            const sx = sourceNode.position.x + 120 // 節點寬度一半
            const sy = sourceNode.position.y + 30 // 節點高度一半
            const tx = targetNode.position.x
            const ty = targetNode.position.y + 30

            // 貝塞爾曲線
            const controlOffset = Math.abs(tx - sx) / 2
            const path = `M ${sx} ${sy} C ${sx + controlOffset} ${sy}, ${tx - controlOffset} ${ty}, ${tx} ${ty}`

            return (
              <path
                key={edge.id}
                d={path}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                className="text-muted-foreground/50"
              />
            )
          })}
        </svg>

        {/* 節點 */}
        {nodes.map((node) => (
          <WorkflowNodeComponent
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onSelect={() => onNodeSelect(node)}
            onMove={(pos) => onNodeMove(node.id, pos)}
            onDelete={() => onNodeDelete(node.id)}
            onStartConnect={() => handleStartConnect(node.id)}
            onEndConnect={() => handleEndConnect(node.id)}
            isConnecting={!!connectingFrom}
          />
        ))}
      </div>

      {/* 空狀態 */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">從左側拖拽節點開始</p>
            <p className="text-sm">或點擊節點添加到畫布</p>
          </div>
        </div>
      )}
    </div>
  )
}
