'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Receipt,
  Nfc,
  FileText,
  Home,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { YahabWordmark } from '@/components/yahab/logo'
import { adminLogout } from '@/lib/admin-auth'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/transactions', label: 'Transactions', icon: Receipt },
  { href: '/admin/tags', label: 'Tap tags', icon: Nfc },
  { href: '/admin/statements', label: 'Statements', icon: FileText },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    adminLogout()
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar — Ink surface, violet only on active item (per style guide 5.4) */}
      <aside className="hidden w-60 shrink-0 flex-col bg-ink p-4 md:flex">
        <div className="px-2 py-3">
          <YahabWordmark tone="light" />
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-violet text-white'
                    : 'text-[#c4c6d2] hover:bg-[#232a4d] hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="flex flex-col gap-1 border-t border-[#2a3155] pt-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#c4c6d2] transition-colors hover:bg-[#232a4d] hover:text-white"
          >
            <Home className="h-4 w-4" />
            Donor site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#c4c6d2] transition-colors hover:bg-[#232a4d] hover:text-signal"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-hairline px-5 py-3 md:hidden">
          <YahabWordmark />
          <nav className="flex gap-1">
            {NAV.map((item) => {
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                    active ? 'bg-violet text-white' : 'text-ink hover:bg-ink-tint-10',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              )
            })}
            {/* Mobile logout */}
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ink-tint-10 hover:text-signal"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        </header>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
