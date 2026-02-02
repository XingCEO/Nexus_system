/**
 * 用量追蹤系統 - 追蹤用戶使用量並檢查限制
 */

import { User, MemberTier, tierConfigs } from './auth'

// localStorage keys
const USAGE_KEY = 'nexus_usage'

export interface UsageData {
  date: string // YYYY-MM-DD
  messages: number
  workflows: string[] // workflow IDs
  agents: string[] // agent IDs
  mcpTools: string[] // enabled tool IDs
}

export interface UsageLimits {
  dailyMessages: number | 'unlimited'
  workflows: number | 'unlimited'
  agents: number | 'unlimited'
  mcpTools: number | 'all'
}

export interface LimitCheckResult {
  allowed: boolean
  current: number
  limit: number | 'unlimited' | 'all'
  message?: string
}

/**
 * 取得今日日期字串
 */
function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * 取得用戶用量資料
 */
export function getUsageData(): UsageData {
  if (typeof window === 'undefined') {
    return {
      date: getTodayString(),
      messages: 0,
      workflows: [],
      agents: [],
      mcpTools: [],
    }
  }

  const stored = localStorage.getItem(USAGE_KEY)
  if (!stored) {
    return {
      date: getTodayString(),
      messages: 0,
      workflows: [],
      agents: [],
      mcpTools: [],
    }
  }

  try {
    const data = JSON.parse(stored) as UsageData
    // 如果是新的一天，重置每日計數
    if (data.date !== getTodayString()) {
      return {
        date: getTodayString(),
        messages: 0,
        workflows: data.workflows, // 保留工作流
        agents: data.agents, // 保留 agents
        mcpTools: data.mcpTools, // 保留已啟用的工具
      }
    }
    return data
  } catch {
    return {
      date: getTodayString(),
      messages: 0,
      workflows: [],
      agents: [],
      mcpTools: [],
    }
  }
}

/**
 * 儲存用量資料
 */
export function saveUsageData(data: UsageData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USAGE_KEY, JSON.stringify(data))
  }
}

/**
 * 取得用戶的限制設定
 */
export function getUserLimits(tier: MemberTier): UsageLimits {
  const config = tierConfigs[tier]
  return {
    dailyMessages: config.limits.dailyMessages,
    workflows: config.limits.workflows,
    agents: config.limits.agents,
    mcpTools: config.limits.mcpTools,
  }
}

/**
 * 檢查每日訊息限制
 */
export function checkMessageLimit(user: User | null): LimitCheckResult {
  if (!user) {
    return { allowed: false, current: 0, limit: 0, message: '請先登入' }
  }

  const limits = getUserLimits(user.tier)
  const usage = getUsageData()

  if (limits.dailyMessages === 'unlimited') {
    return { allowed: true, current: usage.messages, limit: 'unlimited' }
  }

  const allowed = usage.messages < limits.dailyMessages
  return {
    allowed,
    current: usage.messages,
    limit: limits.dailyMessages,
    message: allowed ? undefined : `今日訊息已達上限 (${limits.dailyMessages} 則)，請升級方案或明天再試`,
  }
}

/**
 * 檢查工作流數量限制
 */
export function checkWorkflowLimit(user: User | null): LimitCheckResult {
  if (!user) {
    return { allowed: false, current: 0, limit: 0, message: '請先登入' }
  }

  const limits = getUserLimits(user.tier)
  const usage = getUsageData()

  if (limits.workflows === 'unlimited') {
    return { allowed: true, current: usage.workflows.length, limit: 'unlimited' }
  }

  const allowed = usage.workflows.length < limits.workflows
  return {
    allowed,
    current: usage.workflows.length,
    limit: limits.workflows,
    message: allowed ? undefined : `工作流數量已達上限 (${limits.workflows} 個)，請升級方案`,
  }
}

/**
 * 檢查 Agent 數量限制
 */
export function checkAgentLimit(user: User | null): LimitCheckResult {
  if (!user) {
    return { allowed: false, current: 0, limit: 0, message: '請先登入' }
  }

  const limits = getUserLimits(user.tier)
  const usage = getUsageData()

  if (limits.agents === 'unlimited') {
    return { allowed: true, current: usage.agents.length, limit: 'unlimited' }
  }

  const allowed = usage.agents.length < limits.agents
  return {
    allowed,
    current: usage.agents.length,
    limit: limits.agents,
    message: allowed ? undefined : `Agent 數量已達上限 (${limits.agents} 個)，請升級方案`,
  }
}

/**
 * 檢查 MCP 工具數量限制
 */
export function checkMcpToolLimit(user: User | null): LimitCheckResult {
  if (!user) {
    return { allowed: false, current: 0, limit: 0, message: '請先登入' }
  }

  const limits = getUserLimits(user.tier)
  const usage = getUsageData()

  if (limits.mcpTools === 'all') {
    return { allowed: true, current: usage.mcpTools.length, limit: 'all' }
  }

  const allowed = usage.mcpTools.length < limits.mcpTools
  return {
    allowed,
    current: usage.mcpTools.length,
    limit: limits.mcpTools,
    message: allowed ? undefined : `MCP 工具數量已達上限 (${limits.mcpTools} 個)，請升級方案`,
  }
}

/**
 * 增加訊息計數
 */
export function incrementMessageCount(): void {
  const usage = getUsageData()
  usage.messages++
  saveUsageData(usage)
}

/**
 * 新增工作流
 */
export function addWorkflow(workflowId: string): boolean {
  const usage = getUsageData()
  if (!usage.workflows.includes(workflowId)) {
    usage.workflows.push(workflowId)
    saveUsageData(usage)
  }
  return true
}

/**
 * 移除工作流
 */
export function removeWorkflow(workflowId: string): void {
  const usage = getUsageData()
  usage.workflows = usage.workflows.filter(id => id !== workflowId)
  saveUsageData(usage)
}

/**
 * 新增 Agent
 */
export function addAgent(agentId: string): boolean {
  const usage = getUsageData()
  if (!usage.agents.includes(agentId)) {
    usage.agents.push(agentId)
    saveUsageData(usage)
  }
  return true
}

/**
 * 移除 Agent
 */
export function removeAgent(agentId: string): void {
  const usage = getUsageData()
  usage.agents = usage.agents.filter(id => id !== agentId)
  saveUsageData(usage)
}

/**
 * 啟用 MCP 工具
 */
export function enableMcpTool(toolId: string): boolean {
  const usage = getUsageData()
  if (!usage.mcpTools.includes(toolId)) {
    usage.mcpTools.push(toolId)
    saveUsageData(usage)
  }
  return true
}

/**
 * 停用 MCP 工具
 */
export function disableMcpTool(toolId: string): void {
  const usage = getUsageData()
  usage.mcpTools = usage.mcpTools.filter(id => id !== toolId)
  saveUsageData(usage)
}

/**
 * 取得用量摘要
 */
export function getUsageSummary(user: User | null): {
  messages: LimitCheckResult
  workflows: LimitCheckResult
  agents: LimitCheckResult
  mcpTools: LimitCheckResult
} {
  return {
    messages: checkMessageLimit(user),
    workflows: checkWorkflowLimit(user),
    agents: checkAgentLimit(user),
    mcpTools: checkMcpToolLimit(user),
  }
}

/**
 * 重置用量資料（用於測試或管理員操作）
 */
export function resetUsageData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USAGE_KEY)
  }
}
