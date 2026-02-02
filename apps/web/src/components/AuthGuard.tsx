'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, AUTH_CHANGE_EVENT, type User } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.replace('/login')
        return
      }
      setUser(currentUser)
      setIsLoading(false)
    }

    checkUser()
  }, [router])

  // 監聽 Supabase auth 狀態變更
  useEffect(() => {
    const supabase = createClient()

    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/login')
      } else if (event === 'SIGNED_IN' && session) {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // 監聯自定義 auth 事件
  useEffect(() => {
    const handleAuthChange = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.replace('/login')
      } else {
        setUser(currentUser)
      }
    }

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    }
  }, [router])

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">載入中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

// Hook to get current user with reactive updates
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    refreshUser().then(() => setIsLoading(false))

    // 監聽 Supabase auth 狀態變更
    const supabase = createClient()
    let subscription: { unsubscribe: () => void } | null = null

    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async () => {
        await refreshUser()
      })
      subscription = data.subscription
    }

    // 監聽自定義事件
    const handleAuthChange = () => {
      refreshUser()
    }
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)

    return () => {
      subscription?.unsubscribe()
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    }
  }, [refreshUser])

  return { user, isLoading, refreshUser }
}
