import { z } from 'zod'

// Agent 型別定義
export const AgentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  model: z.enum(['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'gpt-4o', 'gpt-4o-mini', 'ollama']),
  systemPrompt: z.string().optional(),
  tools: z.array(z.string()).default([]),
  memoryEnabled: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Agent = z.infer<typeof AgentSchema>

// Memory 型別定義
export const MemorySchema = z.object({
  id: z.string().uuid(),
  agentId: z.string().uuid(),
  type: z.enum(['fact', 'preference', 'experience', 'relationship']),
  content: z.string(),
  embedding: z.array(z.number()).optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Memory = z.infer<typeof MemorySchema>

// Message 型別定義
export const MessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  agentId: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
})

export type Message = z.infer<typeof MessageSchema>

// Workflow 型別定義
export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['trigger', 'action', 'condition', 'agent']),
  data: z.record(z.unknown()),
  position: z.object({ x: z.number(), y: z.number() }),
})

export const WorkflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
})

export const WorkflowSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  nodes: z.array(WorkflowNodeSchema),
  edges: z.array(WorkflowEdgeSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Workflow = z.infer<typeof WorkflowSchema>
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>

// API Response 型別
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}
