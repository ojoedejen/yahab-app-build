import Link from 'next/link'
import { Nfc, Repeat, Globe, ArrowRight, ShieldCheck } from 'lucide-react'
import { YahabWordmark } from '@/components/yahab/logo'
import { funds } from '@/lib/yahab-data'

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background">
      {/* Nav */}
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <YahabWordmark />
          <nav className="flex items-center gap-2">
            <Link
              href="/give"
              className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ad2a28]"
            >
              Give now
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — decision moment rendered as solid Yahab Ink (gradient intentionally omitted) */}
      <section className="bg-ink">
        <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a9db3]">
            Kharis Church
          </p>
          <h1 className="mx-auto mt-5 max-w-2xl text-balance font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
            Give in seconds — online, in your seat, or with a single tap.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-[#c4c6d2]">
            One calm, secure place to give to Kharis Church. No app to download, no
            friction — just generosity, made simple.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/give"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-signal px-7 font-semibold text-white transition-colors hover:bg-[#ad2a28]"
            >
              Give now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tap/seat-b12"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#2a3155] px-7 font-medium text-white transition-colors hover:border-violet"
            >
              <Nfc className="h-4 w-4" /> Try a tap demo
            </Link>
          </div>
        </div>
      </section>

      {/* Ways to give */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center font-serif text-2xl font-semibold text-ink">
          Three ways to give
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <Feature
            icon={Globe}
            title="Online"
            body="Give from anywhere with card, bank transfer, Apple Pay, or Google Pay."
          />
          <Feature
            icon={Nfc}
            title="Tap to give"
            body="Tap your phone on a tag in your seat to open the giving page instantly."
          />
          <Feature
            icon={Repeat}
            title="Recurring"
            body="Set a weekly or monthly gift and manage it anytime from your account."
          />
        </div>
      </section>

      {/* Funds */}
      <section className="border-t border-hairline bg-card">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink">Where your gift goes</h2>
              <p className="mt-2 max-w-md leading-relaxed text-ink-tint-40">
                Choose the fund that matters most to you. Every gift is tracked and
                receipted.
              </p>
            </div>
            <Link
              href="/give"
              className="flex items-center gap-1.5 text-sm font-medium text-violet hover:underline"
            >
              Start giving <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {funds.map((f) => (
              <Link
                key={f.id}
                href={`/give?fund=${f.id}`}
                className="rounded-xl border border-hairline p-5 transition-colors hover:border-violet"
              >
                <h3 className="font-medium text-ink">{f.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-tint-40">{f.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <YahabWordmark />
          <p className="flex items-center gap-1.5 text-sm text-ink-tint-40">
            <ShieldCheck className="h-4 w-4 text-violet" />
            Donor data encrypted and kept private.
          </p>
        </div>
      </footer>
    </main>
  )
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Globe
  title: string
  body: string
}) {
  return (
    <div className="rounded-xl border border-hairline p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-tint-10">
        <Icon className="h-5 w-5 text-violet" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 leading-relaxed text-ink-tint-40">{body}</p>
    </div>
  )
}
