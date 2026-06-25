import { LoginForm } from '@/components/admin/login-form'
import { YahabWordmark } from '@/components/yahab/logo'
import { ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin login — Yahab',
  // Prevent search engines from indexing the admin login page
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink px-5">
      {/* Brand */}
      <div className="mb-8">
        <YahabWordmark tone="light" />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-[#2a3155] bg-[#1c2240] p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-tint-10">
            <ShieldCheck className="h-6 w-6 text-violet" />
          </span>
          <h1 className="font-serif text-2xl font-semibold text-white">
            Staff portal
          </h1>
          <p className="mt-1.5 text-sm text-[#9a9db3]">
            Enter your admin passcode to continue.
          </p>
        </div>

        <LoginForm />
      </div>

      {/* Donor link — keep the path to giving always visible */}
      <p className="mt-6 text-sm text-[#9a9db3]">
        Looking to give?{' '}
        <a href="/give" className="font-medium text-violet hover:underline">
          Go to the giving page →
        </a>
      </p>
    </div>
  )
}
