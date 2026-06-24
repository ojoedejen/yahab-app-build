'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Nfc } from 'lucide-react'
import { YahabWordmark } from '@/components/yahab/logo'

export function TapRedirect({
  slug,
  label,
  destination,
}: {
  slug: string
  label: string
  destination: string
}) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(2)

  const target = `${destination}${destination.includes('?') ? '&' : '?'}source=${slug}`

  useEffect(() => {
    const tick = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000)
    const go = setTimeout(() => router.push(target), 2000)
    return () => {
      clearInterval(tick)
      clearTimeout(go)
    }
  }, [router, target])

  return (
    // Tap moment: solid Yahab Ink (gradient intentionally omitted per request)
    <main className="flex min-h-dvh flex-col items-center justify-center bg-ink px-6 text-center text-white">
      <YahabWordmark tone="light" className="absolute top-8" />

      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-violet">
        <Nfc className="h-9 w-9 text-white" />
      </span>

      <h1 className="mt-8 font-serif text-3xl font-semibold">Tag detected</h1>
      <p className="mt-2 text-[#c4c6d2]">{label}</p>

      <p className="mt-8 max-w-xs text-pretty leading-relaxed text-[#c4c6d2]">
        Opening your giving page{countdown > 0 ? ` in ${countdown}…` : '…'}
      </p>

      <button
        onClick={() => router.push(target)}
        className="mt-8 h-12 rounded-xl bg-violet px-8 font-medium text-white transition-colors hover:bg-[#4d3179]"
      >
        Continue now
      </button>

      <p className="absolute bottom-8 font-mono text-xs text-[#9a9db3]">
        tap/{slug} → {destination}
      </p>
    </main>
  )
}
