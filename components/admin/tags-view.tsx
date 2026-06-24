'use client'

import { useState } from 'react'
import { Nfc, Check, X, Pencil, Copy } from 'lucide-react'
import { tapTags as seed, type TapTag, formatDateTime } from '@/lib/yahab-data'
import { cn } from '@/lib/utils'

const DESTINATIONS = [
  { value: '/give', label: 'Giving page (general)' },
  { value: '/give?fund=tithe', label: 'Giving — Tithe' },
  { value: '/give?fund=offering', label: 'Giving — Offering' },
  { value: '/give?fund=missions', label: 'Giving — Missions' },
  { value: '/give?fund=building', label: 'Giving — Building Fund' },
  { value: '/events', label: 'Event signup' },
]

export function TagsView() {
  const [tags, setTags] = useState<TapTag[]>(seed)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  function startEdit(tag: TapTag) {
    setEditing(tag.id)
    setDraft(tag.destination)
  }
  function save(id: string) {
    setTags((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, destination: draft, updatedAt: new Date().toISOString() } : t,
      ),
    )
    setEditing(null)
  }
  function toggleActive(id: string) {
    setTags((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, active: !t.active, updatedAt: new Date().toISOString() } : t,
      ),
    )
  }
  function copyUrl(slug: string) {
    navigator.clipboard?.writeText(`${origin}/tap/${slug}`)
    setCopied(slug)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Tap tags</h1>
      <p className="mt-1 max-w-2xl text-pretty leading-relaxed text-ink-tint-40">
        Each physical NFC tag points to a fixed URL on Kharis Church&apos;s domain. Change where
        a tag sends people here — the change takes effect instantly, with no need to
        reprogram the hardware.
      </p>

      <div className="mt-6 grid gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={cn(
              'rounded-xl border bg-card p-5',
              tag.active ? 'border-hairline' : 'border-hairline opacity-70',
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
                    tag.active ? 'bg-violet-tint-10 text-violet' : 'bg-ink-tint-10 text-ink-tint-40',
                  )}
                >
                  <Nfc className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-medium text-ink">{tag.label}</h2>
                  <button
                    onClick={() => copyUrl(tag.slug)}
                    className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-ink-tint-40 transition-colors hover:text-violet"
                  >
                    /tap/{tag.slug}
                    {copied === tag.slug ? (
                      <Check className="h-3 w-3 text-violet" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-tint-40">
                    <span>
                      <span className="text-ink">{tag.scansToday}</span> taps today
                    </span>
                    <span>
                      <span className="text-ink">{tag.scans30d}</span> taps · 30d
                    </span>
                    <span>Updated {formatDateTime(tag.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleActive(tag.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  tag.active
                    ? 'bg-violet-tint-10 text-violet'
                    : 'bg-ink-tint-10 text-ink-tint-40',
                )}
              >
                {tag.active ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                {tag.active ? 'Active' : 'Inactive'}
              </button>
            </div>

            {/* Destination editor */}
            <div className="mt-4 flex flex-col gap-2 rounded-lg border border-hairline p-3 sm:flex-row sm:items-center">
              <span className="text-sm text-ink-tint-40">Points to</span>
              {editing === tag.id ? (
                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <select
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="h-10 flex-1 rounded-lg border border-hairline bg-card px-3 text-sm text-ink outline-none"
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => save(tag.id)}
                    className="h-10 rounded-lg bg-violet px-4 text-sm font-medium text-white transition-colors hover:bg-[#4d3179]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="h-10 rounded-lg border border-hairline px-4 text-sm font-medium text-ink transition-colors hover:bg-ink-tint-10"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-between">
                  <code className="font-mono text-sm text-ink">{tag.destination}</code>
                  <button
                    onClick={() => startEdit(tag)}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-violet transition-colors hover:bg-violet-tint-10"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Change
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
