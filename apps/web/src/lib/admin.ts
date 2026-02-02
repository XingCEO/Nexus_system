/**
 * 管理後台 API - 用戶管理功能
 */

import { User, MemberTier } from './auth'
import { createClient } from '@/lib/supabase/client'

// 測試帳號（與 auth.ts 保持同步）
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

export interface UserStats {
  total: number
  byTier: Record<MemberTier, number>
  newToday: number
}

export interface UpdateUserData {
  tier?: MemberTier
  expiresAt?: string | null
  name?: string
}

/**
 * 取得所有用戶列表
 */
export async function getAllUsers(): Promise<User[]> {
  const supabase = createClient()

  if (!supabase) {
    // localStorage fallback 模式
    const users: User[] = []

    // 加入測試帳號
    Object.values(testAccounts).forEach(({ user }) => {
      users.push(user)
    })

    // 加入註冊帳號
    if (typeof window !== 'undefined') {
      const registeredAccounts = localStorage.getItem('nexus_registered_accounts')
      if (registeredAccounts) {
        try {
          const accounts = JSON.parse(registeredAccounts)
          Object.values(accounts).forEach((account: any) => {
            if (account.user) {
              users.push(account.user)
            }
          })
        } catch {
          // 忽略解析錯誤
        }
      }
    }

    return users
  }

  // Supabase 模式 - 需要 admin API 或 profiles 表
  // 這裡使用簡化版本，實際生產環境需要 service role key
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    return users.map(u => ({
      id: u.id,
      email: u.email || '',
      name: u.user_metadata?.name || u.user_metadata?.full_name || u.email?.split('@')[0] || '',
      avatar: u.user_metadata?.avatar_url,
      tier: u.user_metadata?.tier || 'free',
      permissions: u.user_metadata?.permissions || ['basic'],
      createdAt: u.created_at,
      expiresAt: u.user_metadata?.expiresAt,
    }))
  } catch {
    // 如果沒有 admin 權限，返回空陣列
    return []
  }
}

/**
 * 取得用戶統計資料
 */
export async function getUserStats(): Promise<UserStats> {
  const users = await getAllUsers()
  const today = new Date().toISOString().split('T')[0]

  const stats: UserStats = {
    total: users.length,
    byTier: {
      free: 0,
      pro: 0,
      enterprise: 0,
      internal: 0,
    },
    newToday: 0,
  }

  users.forEach(user => {
    stats.byTier[user.tier]++
    if (user.createdAt.startsWith(today)) {
      stats.newToday++
    }
  })

  return stats
}

/**
 * 更新用戶資料
 */
export async function updateUser(userId: string, data: UpdateUserData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  if (!supabase) {
    // localStorage fallback 模式
    if (typeof window !== 'undefined') {
      // 先檢查是否為測試帳號（測試帳號無法修改）
      const testUser = Object.entries(testAccounts).find(([_, acc]) => acc.user.id === userId)
      if (testUser) {
        // 測試帳號不儲存到 localStorage，但更新記憶體中的資料
        // 實際上這些更改不會持久化
        return { success: true }
      }

      // 更新註冊帳號
      const registeredAccounts = localStorage.getItem('nexus_registered_accounts')
      if (registeredAccounts) {
        try {
          const accounts = JSON.parse(registeredAccounts)

          for (const email of Object.keys(accounts)) {
            if (accounts[email].user.id === userId) {
              // 更新用戶資料
              if (data.tier !== undefined) {
                accounts[email].user.tier = data.tier
              }
              if (data.expiresAt !== undefined) {
                if (data.expiresAt === null) {
                  delete accounts[email].user.expiresAt
                } else {
                  accounts[email].user.expiresAt = data.expiresAt
                }
              }
              if (data.name !== undefined) {
                accounts[email].user.name = data.name
              }

              localStorage.setItem('nexus_registered_accounts', JSON.stringify(accounts))

              // 如果是當前登入用戶，也更新 nexus_user
              const currentUser = localStorage.getItem('nexus_user')
              if (currentUser) {
                const user = JSON.parse(currentUser)
                if (user.id === userId) {
                  localStorage.setItem('nexus_user', JSON.stringify({
                    ...user,
                    ...data,
                  }))
                }
              }

              return { success: true }
            }
          }
        } catch {
          return { success: false, error: '更新失敗' }
        }
      }

      return { success: false, error: '找不到用戶' }
    }

    return { success: false, error: '無法存取 localStorage' }
  }

  // Supabase 模式
  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: data,
    })

    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message || '更新失敗' }
  }
}

/**
 * 刪除用戶
 */
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  if (!supabase) {
    // localStorage fallback 模式
    if (typeof window !== 'undefined') {
      // 測試帳號不允許刪除
      const testUser = Object.entries(testAccounts).find(([_, acc]) => acc.user.id === userId)
      if (testUser) {
        return { success: false, error: '無法刪除測試帳號' }
      }

      // 刪除註冊帳號
      const registeredAccounts = localStorage.getItem('nexus_registered_accounts')
      if (registeredAccounts) {
        try {
          const accounts = JSON.parse(registeredAccounts)

          for (const email of Object.keys(accounts)) {
            if (accounts[email].user.id === userId) {
              delete accounts[email]
              localStorage.setItem('nexus_registered_accounts', JSON.stringify(accounts))
              return { success: true }
            }
          }
        } catch {
          return { success: false, error: '刪除失敗' }
        }
      }

      return { success: false, error: '找不到用戶' }
    }

    return { success: false, error: '無法存取 localStorage' }
  }

  // Supabase 模式
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message || '刪除失敗' }
  }
}
