'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogoMark } from '@/components/Logo'
import { cn } from '@/lib/utils'
import { AuthGuard, useUser } from '@/components/AuthGuard'
import { User, MemberTier, getTierConfig, hasPermission, tierConfigs } from '@/lib/auth'
import { getAllUsers, getUserStats, updateUser, deleteUser, UserStats, UpdateUserData } from '@/lib/admin'

type AdminTab = 'overview' | 'users'

function AdminIcon({ id, className }: { id: string; className?: string }) {
  const iconClass = cn('w-5 h-5', className)

  switch (id) {
    case 'overview':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    case 'users':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass}>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21v-2a3 3 0 0 0-3-3h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    default:
      return null
  }
}

const TABS = [
  { id: 'overview', label: '總覽' },
  { id: 'users', label: '會員管理' },
] as const

interface EditModalState {
  isOpen: boolean
  user: User | null
  tier: MemberTier
  expiresAt: string
}

interface DeleteModalState {
  isOpen: boolean
  user: User | null
}

function AdminContent() {
  const router = useRouter()
  const { user: currentUser, isLoading: userLoading } = useUser()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<MemberTier | 'all'>('all')

  // Modal states
  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    user: null,
    tier: 'free',
    expiresAt: '',
  })
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    user: null,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // 權限檢查
  useEffect(() => {
    if (!userLoading && currentUser && !hasPermission(currentUser, 'admin')) {
      router.push('/app')
    }
  }, [currentUser, userLoading, router])

  // 載入資料
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [usersData, statsData] = await Promise.all([
          getAllUsers(),
          getUserStats(),
        ])
        setUsers(usersData)
        setStats(statsData)
      } catch (error) {
        console.error('Failed to load admin data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (currentUser && hasPermission(currentUser, 'admin')) {
      loadData()
    }
  }, [currentUser])

  // 篩選用戶
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTier = tierFilter === 'all' || user.tier === tierFilter
      return matchesSearch && matchesTier
    })
  }, [users, searchQuery, tierFilter])

  // 開啟編輯 Modal
  const openEditModal = (user: User) => {
    setEditModal({
      isOpen: true,
      user,
      tier: user.tier,
      expiresAt: user.expiresAt || '',
    })
  }

  // 儲存用戶變更
  const handleSaveUser = async () => {
    if (!editModal.user) return

    setIsSaving(true)
    try {
      const updateData: UpdateUserData = {
        tier: editModal.tier,
        expiresAt: editModal.expiresAt || null,
      }

      const result = await updateUser(editModal.user.id, updateData)

      if (result.success) {
        // 更新本地狀態
        setUsers(users.map(u =>
          u.id === editModal.user!.id
            ? { ...u, tier: editModal.tier, expiresAt: editModal.expiresAt || undefined }
            : u
        ))
        // 重新計算統計
        const newStats = await getUserStats()
        setStats(newStats)
        setEditModal({ isOpen: false, user: null, tier: 'free', expiresAt: '' })
      } else {
        alert(result.error || '更新失敗')
      }
    } catch (error) {
      alert('更新失敗')
    } finally {
      setIsSaving(false)
    }
  }

  // 刪除用戶
  const handleDeleteUser = async () => {
    if (!deleteModal.user) return

    setIsDeleting(true)
    try {
      const result = await deleteUser(deleteModal.user.id)

      if (result.success) {
        setUsers(users.filter(u => u.id !== deleteModal.user!.id))
        const newStats = await getUserStats()
        setStats(newStats)
        setDeleteModal({ isOpen: false, user: null })
      } else {
        alert(result.error || '刪除失敗')
      }
    } catch (error) {
      alert('刪除失敗')
    } finally {
      setIsDeleting(false)
    }
  }

  // 權限檢查中或無權限
  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-foreground border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!currentUser || !hasPermission(currentUser, 'admin')) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app" className="flex items-center gap-2.5 hover:opacity-90 transition-all">
              <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                <LogoMark className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">超級系統</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm">管理後台</span>
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded", tierConfigs.internal.bgColor, tierConfigs.internal.color)}>
              Admin
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-48 shrink-0">
            <ul className="space-y-1">
              {TABS.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                      activeTab === tab.id
                        ? 'bg-secondary text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    <AdminIcon id={tab.id} className={activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">總覽</h2>
                  <p className="text-sm text-muted-foreground mt-1">系統狀態與會員統計</p>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-foreground border-t-transparent rounded-full" />
                  </div>
                ) : stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 總會員數 */}
                    <div className="p-4 rounded-xl border border-border/50 bg-card/30">
                      <div className="text-sm text-muted-foreground">會員總數</div>
                      <div className="text-3xl font-bold mt-1">{stats.total}</div>
                    </div>

                    {/* 今日新增 */}
                    <div className="p-4 rounded-xl border border-border/50 bg-card/30">
                      <div className="text-sm text-muted-foreground">今日新增</div>
                      <div className="text-3xl font-bold mt-1 text-green-500">+{stats.newToday}</div>
                    </div>

                    {/* 付費會員 */}
                    <div className="p-4 rounded-xl border border-border/50 bg-card/30">
                      <div className="text-sm text-muted-foreground">付費會員</div>
                      <div className="text-3xl font-bold mt-1 text-blue-500">
                        {stats.byTier.pro + stats.byTier.enterprise}
                      </div>
                    </div>

                    {/* 內部測試 */}
                    <div className="p-4 rounded-xl border border-border/50 bg-card/30">
                      <div className="text-sm text-muted-foreground">內部測試</div>
                      <div className="text-3xl font-bold mt-1 text-amber-500">{stats.byTier.internal}</div>
                    </div>
                  </div>
                )}

                {/* 等級分佈 */}
                {stats && (
                  <div className="p-4 rounded-xl border border-border/50 bg-card/30">
                    <div className="text-sm font-medium mb-4">等級分佈</div>
                    <div className="space-y-3">
                      {(Object.keys(tierConfigs) as MemberTier[]).map(tier => {
                        const config = tierConfigs[tier]
                        const count = stats.byTier[tier]
                        const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0

                        return (
                          <div key={tier} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className={cn("font-medium px-2 py-0.5 rounded", config.bgColor, config.color)}>
                                {config.name}
                              </span>
                              <span className="text-muted-foreground">{count} 人 ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all", config.bgColor.replace('/10', ''))}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">會員管理</h2>
                  <p className="text-sm text-muted-foreground mt-1">管理所有會員帳號</p>
                </div>

                {/* 搜尋與篩選 */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="搜尋姓名或 Email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value as MemberTier | 'all')}
                    className="h-10 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">所有等級</option>
                    <option value="free">免費版</option>
                    <option value="pro">專業版</option>
                    <option value="enterprise">企業版</option>
                    <option value="internal">內部測試</option>
                  </select>
                </div>

                {/* 用戶列表 */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-foreground border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="border border-border/50 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/50 bg-secondary/30">
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">用戶</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">等級</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">註冊日期</th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">到期日</th>
                            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                                沒有找到符合條件的用戶
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((user) => {
                              const tierConfig = getTierConfig(user.tier)
                              return (
                                <tr key={user.id} className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                                          {user.name.charAt(0)}
                                        </div>
                                      )}
                                      <div>
                                        <div className="text-sm font-medium">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded", tierConfig.bgColor, tierConfig.color)}>
                                      {tierConfig.name}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {user.createdAt}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {user.expiresAt || '-'}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => openEditModal(user)}
                                        className="h-8 px-3 rounded-lg border border-border/50 text-xs hover:bg-secondary transition-all"
                                      >
                                        編輯
                                      </button>
                                      <button
                                        onClick={() => setDeleteModal({ isOpen: true, user })}
                                        className="h-8 px-3 rounded-lg border border-red-500/50 text-xs text-red-500 hover:bg-red-500/10 transition-all"
                                      >
                                        刪除
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  顯示 {filteredUsers.length} / {users.length} 位用戶
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editModal.isOpen && editModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isSaving && setEditModal({ isOpen: false, user: null, tier: 'free', expiresAt: '' })} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-background rounded-2xl border border-border p-6 w-full max-w-md mx-4 shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-4">編輯用戶</h3>

            <div className="flex items-center gap-3 mb-6">
              {editModal.user.avatar ? (
                <img src={editModal.user.avatar} alt={editModal.user.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-medium">
                  {editModal.user.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-medium">{editModal.user.name}</div>
                <div className="text-sm text-muted-foreground">{editModal.user.email}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">會員等級</label>
                <select
                  value={editModal.tier}
                  onChange={(e) => setEditModal({ ...editModal, tier: e.target.value as MemberTier })}
                  className="w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="free">免費版</option>
                  <option value="pro">專業版</option>
                  <option value="enterprise">企業版</option>
                  <option value="internal">內部測試</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">到期日期</label>
                <input
                  type="date"
                  value={editModal.expiresAt}
                  onChange={(e) => setEditModal({ ...editModal, expiresAt: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground">留空表示無期限</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setEditModal({ isOpen: false, user: null, tier: 'free', expiresAt: '' })}
                disabled={isSaving}
                className="h-10 px-4 rounded-lg border border-border text-sm hover:bg-secondary transition-all disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleSaveUser}
                disabled={isSaving}
                className="h-10 px-4 rounded-lg bg-foreground text-background text-sm hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    儲存中...
                  </>
                ) : (
                  '儲存'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteModal.isOpen && deleteModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isDeleting && setDeleteModal({ isOpen: false, user: null })} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-background rounded-2xl border border-border p-6 w-full max-w-md mx-4 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-red-500 mb-2">刪除用戶</h3>
            <p className="text-sm text-muted-foreground mb-4">
              確定要刪除用戶 <span className="font-medium text-foreground">{deleteModal.user.name}</span> ({deleteModal.user.email}) 嗎？
            </p>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-6">
              <p className="text-sm text-red-500 font-medium">
                此操作無法復原！
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ isOpen: false, user: null })}
                disabled={isDeleting}
                className="h-10 px-4 rounded-lg border border-border text-sm hover:bg-secondary transition-all disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    刪除中...
                  </>
                ) : (
                  '確認刪除'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminContent />
    </AuthGuard>
  )
}
