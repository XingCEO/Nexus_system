/**
 * 認證系統 - 支援 Supabase 或 localStorage fallback
 */

import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export type MemberTier = 'free' | 'pro' | 'enterprise' | 'internal'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  tier: MemberTier
  permissions: string[]
  createdAt: string
  expiresAt?: string
}

export interface TierConfig {
  name: string
  nameEn: string
  color: string
  bgColor: string
  features: string[]
  limits: {
    dailyMessages: number | 'unlimited'
    memoryCapacity: string
    mcpTools: number | 'all'
    workflows: number | 'unlimited'
    agents: number | 'unlimited'
  }
}

export const tierConfigs: Record<MemberTier, TierConfig> = {
  free: {
    name: '免費版',
    nameEn: 'Free',
    color: 'text-gray-600',
    bgColor: 'bg-gray-500/10',
    features: ['基礎對話', '基礎記憶', '3 個 MCP 工具'],
    limits: {
      dailyMessages: 50,
      memoryCapacity: '1GB',
      mcpTools: 3,
      workflows: 1,
      agents: 1,
    },
  },
  pro: {
    name: '專業版',
    nameEn: 'Pro',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    features: ['無限對話', '完整記憶', '所有 MCP 工具', '工作流編排', '優先支援'],
    limits: {
      dailyMessages: 'unlimited',
      memoryCapacity: '50GB',
      mcpTools: 'all',
      workflows: 10,
      agents: 5,
    },
  },
  enterprise: {
    name: '企業版',
    nameEn: 'Enterprise',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    features: ['一切專業版功能', '本地部署', '專屬客戶經理', 'SLA 保證', 'API 存取'],
    limits: {
      dailyMessages: 'unlimited',
      memoryCapacity: '500GB',
      mcpTools: 'all',
      workflows: 'unlimited',
      agents: 'unlimited',
    },
  },
  internal: {
    name: '內部測試',
    nameEn: 'Internal',
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    features: [
      '🔓 所有功能解鎖',
      '🧪 實驗性功能搶先體驗',
      '🛠️ 開發者工具',
      '📊 後台管理權限',
      '💎 無任何限制',
    ],
    limits: {
      dailyMessages: 'unlimited',
      memoryCapacity: 'unlimited',
      mcpTools: 'all',
      workflows: 'unlimited',
      agents: 'unlimited',
    },
  },
}

// 內測帳號 email 清單
const internalEmails = ['admin@nexus.ai']

// 測試帳號 (localStorage fallback 模式)
const testAccounts: Record<string, { password: string; user: User }> = {
  'admin@nexus.ai': {
    password: 'nexus2026',
    user: {
      id: 'usr_internal_001',
      email: 'admin@nexus.ai',
      name: 'Nexus Admin',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      tier: 'internal',
      permissions: ['admin', 'all'],
      createdAt: '2025-01-01',
    },
  },
  'demo@nexus.ai': {
    password: 'demo123',
    user: {
      id: 'usr_demo_001',
      email: 'demo@nexus.ai',
      name: 'Demo User',
      tier: 'pro',
      permissions: ['basic', 'workflows', 'agents'],
      createdAt: '2026-01-15',
      expiresAt: '2026-12-31',
    },
  },
}

// 自定義事件名稱
export const AUTH_CHANGE_EVENT = 'nexus_auth_change'

function dispatchAuthChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT))
  }
}

// 將 Supabase User 轉換為應用 User
export function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const email = supabaseUser.email || ''
  const isInternal = internalEmails.includes(email.toLowerCase())

  return {
    id: supabaseUser.id,
    email,
    name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || email.split('@')[0],
    avatar: supabaseUser.user_metadata?.avatar_url,
    tier: isInternal ? 'internal' : 'free',
    permissions: isInternal ? ['admin', 'all'] : ['basic'],
    createdAt: supabaseUser.created_at,
  }
}

// ============ localStorage Fallback 函數 ============

function localStorageSaveUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nexus_user', JSON.stringify(user))
    dispatchAuthChange()
  }
}

function localStorageGetUser(): User | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('nexus_user')
    if (data) {
      try {
        return JSON.parse(data)
      } catch {
        return null
      }
    }
  }
  return null
}

function localStorageLogout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nexus_user')
    dispatchAuthChange()
  }
}

function localStorageRegister(name: string, email: string, password: string): { success: boolean; user?: User; error?: string } {
  const emailLower = email.toLowerCase()

  if (testAccounts[emailLower]) {
    return { success: false, error: '此電子郵件已被使用' }
  }

  if (typeof window !== 'undefined') {
    const registeredAccounts = localStorage.getItem('nexus_registered_accounts')
    if (registeredAccounts) {
      const accounts = JSON.parse(registeredAccounts)
      if (accounts[emailLower]) {
        return { success: false, error: '此電子郵件已被使用' }
      }
    }
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    email: emailLower,
    name,
    tier: 'free',
    permissions: ['basic'],
    createdAt: new Date().toISOString().split('T')[0],
  }

  if (typeof window !== 'undefined') {
    const registeredAccounts = localStorage.getItem('nexus_registered_accounts')
    const accounts = registeredAccounts ? JSON.parse(registeredAccounts) : {}
    accounts[emailLower] = { password, user: newUser }
    localStorage.setItem('nexus_registered_accounts', JSON.stringify(accounts))
  }

  return { success: true, user: newUser }
}

function localStorageAuthenticate(email: string, password: string): User | null {
  const emailLower = email.toLowerCase()

  const testAccount = testAccounts[emailLower]
  if (testAccount && testAccount.password === password) {
    return testAccount.user
  }

  if (typeof window !== 'undefined') {
    const registeredAccounts = localStorage.getItem('nexus_registered_accounts')
    if (registeredAccounts) {
      const accounts = JSON.parse(registeredAccounts)
      const account = accounts[emailLower]
      if (account && account.password === password) {
        return account.user
      }
    }
  }

  return null
}

// ============ 主要 API (自動選擇模式) ============

export async function signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  if (!supabase) {
    // localStorage fallback
    const result = localStorageRegister(name, email, password)
    if (result.success && result.user) {
      localStorageSaveUser(result.user)
    }
    return result
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { success: false, error: '此電子郵件已被使用' }
    }
    return { success: false, error: error.message }
  }

  dispatchAuthChange()
  return { success: true }
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const supabase = createClient()

  if (!supabase) {
    // localStorage fallback
    const user = localStorageAuthenticate(email, password)
    if (user) {
      localStorageSaveUser(user)
      return { success: true, user }
    }
    return { success: false, error: '電子郵件或密碼錯誤' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: '電子郵件或密碼錯誤' }
  }

  if (data.user) {
    dispatchAuthChange()
    return { success: true, user: mapSupabaseUser(data.user) }
  }

  return { success: false, error: '登入失敗' }
}

export async function signOut(): Promise<void> {
  const supabase = createClient()

  if (!supabase) {
    localStorageLogout()
    return
  }

  await supabase.auth.signOut()
  dispatchAuthChange()
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()

  if (!supabase) {
    return localStorageGetUser()
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return mapSupabaseUser(user)
  }

  return null
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient()
  if (!supabase) {
    console.warn('Google 登入需要設定 Supabase')
    return
  }
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

export async function signInWithGitHub(): Promise<void> {
  const supabase = createClient()
  if (!supabase) {
    console.warn('GitHub 登入需要設定 Supabase')
    return
  }
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false
  if (user.tier === 'internal') return true
  return user.permissions.includes(permission)
}

export function getTierConfig(tier: MemberTier): TierConfig {
  return tierConfigs[tier]
}

// 別名導出（向後相容）
export const logout = signOut
