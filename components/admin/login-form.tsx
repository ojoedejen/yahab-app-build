'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { attemptAdminLogin } from '@/lib/admin-auth'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [passcode, setPasscode] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Small intentional delay — prevents instant brute-force feedback
    setTimeout(() => {
      const ok = attemptAdminLogin(passcode)
      if (ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Incorrect passcode. Please try again.')
        setPasscode('')
        setLoading(false)
        inputRef.current?.focus()
      }
    }, 400)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Lock className="h-4 w-4 text-[#9a9db3]" />
        </div>
        <input
          ref={inputRef}
          type={show ? 'text' : 'password'}
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value)
            setError('')
          }}
          placeholder="Admin passcode"
          autoComplete="current-password"
          aria-label="Admin passcode"
          className={cn(
            'h-12 w-full rounded-xl border bg-[#232a4d] pl-11 pr-11 text-sm text-white outline-none transition-colors placeholder:text-[#5a6080]',
            error
              ? 'border-signal focus:border-signal'
              : 'border-[#2a3155] focus:border-violet',
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#9a9db3] transition-colors hover:text-white"
          aria-label={show ? 'Hide passcode' : 'Show passcode'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-signal/30 bg-signal/10 px-4 py-2.5 text-sm text-signal"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={passcode.length === 0 || loading}
        className="h-12 w-full rounded-xl bg-violet font-semibold text-white transition-colors hover:bg-[#4d3179] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'Verifying…' : 'Enter dashboard'}
      </button>
    </form>
  )
}
