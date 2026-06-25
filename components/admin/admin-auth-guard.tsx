'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'

/**
 * Wraps any admin page. If the session token is missing, redirects to the
 * login page immediately before rendering children.
 *
 * Shows nothing while checking (avoids a flash of the protected content).
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Skip guard on the login page itself — prevents redirect loop
    if (pathname === '/admin/login') {
      setChecked(true)
      return
    }

    if (!isAdminAuthenticated()) {
      router.replace('/admin/login')
    } else {
      setChecked(true)
    }
  }, [pathname, router])

  // Don't flash the dashboard before the redirect fires
  if (!checked) return null

  return <>{children}</>
}
