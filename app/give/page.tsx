import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { GiveFlow } from '@/components/donor/give-flow'
import { YahabWordmark } from '@/components/yahab/logo'

export default async function GivePage({
  searchParams,
}: {
  searchParams: Promise<{ fund?: string; source?: string }>
}) {
  const { fund, source } = await searchParams

  return (
    <main className="min-h-dvh bg-background">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
          <Link href="/">
            <YahabWordmark />
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-ink-tint-40">
            <ShieldCheck className="h-4 w-4 text-violet" />
            Secure
          </span>
        </div>
      </header>

      <GiveFlow initialFund={fund ?? 'tithe'} source={source ?? null} />

      <footer className="mx-auto max-w-md px-5 pb-10 text-center">
        <p className="text-xs leading-relaxed text-ink-tint-40">
          Gifts to Kharis Church are tax-deductible. You&apos;ll receive a receipt by email for your records.
        </p>
      </footer>
    </main>
  )
}
