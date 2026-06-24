'use client'

import { useMemo, useState } from 'react'
import { FileText, Download, Mail } from 'lucide-react'
import { transactions, fundName, formatCurrency } from '@/lib/yahab-data'
import { cn } from '@/lib/utils'

type DonorStatement = {
  name: string
  email: string
  gifts: number
  total: number
}

const PERIODS = [
  { id: 'ytd', label: 'Year to date', start: () => new Date(new Date().getFullYear(), 0, 1) },
  { id: 'q2', label: 'This quarter', start: () => { const d = new Date(); return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1) } },
  { id: '90', label: 'Last 90 days', start: () => new Date(Date.now() - 90 * 86400000) },
]

export function StatementsView() {
  const [period, setPeriod] = useState('ytd')
  const [generated, setGenerated] = useState(false)

  const start = useMemo(
    () => PERIODS.find((p) => p.id === period)!.start(),
    [period],
  )

  const statements = useMemo<DonorStatement[]>(() => {
    const map = new Map<string, DonorStatement>()
    transactions
      .filter((t) => t.status === 'completed' && new Date(t.createdAt) >= start)
      .forEach((t) => {
        const cur = map.get(t.donorEmail) ?? {
          name: t.donorName,
          email: t.donorEmail,
          gifts: 0,
          total: 0,
        }
        cur.gifts += 1
        cur.total += t.amount
        map.set(t.donorEmail, cur)
      })
    return [...map.values()].sort((a, b) => b.total - a.total)
  }, [start])

  const grandTotal = statements.reduce((s, d) => s + d.total, 0)

  function exportBatch() {
    const header = ['Donor', 'Email', 'Gifts', 'Total', 'PeriodStart', 'PeriodEnd']
    const end = new Date().toISOString().slice(0, 10)
    const rows = statements.map((d) => [
      d.name,
      d.email,
      String(d.gifts),
      d.total.toFixed(2),
      start.toISOString().slice(0, 10),
      end,
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yahab-statements-${period}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl font-semibold text-ink">Giving statements</h1>
      <p className="mt-1 max-w-2xl text-pretty leading-relaxed text-ink-tint-40">
        Generate per-donor giving statements for a period — for annual tax receipts or
        on-demand donor requests.
      </p>

      {/* Generator */}
      <div className="mt-6 rounded-xl border border-hairline bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Period</label>
            <div className="flex gap-1 rounded-xl border border-hairline p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPeriod(p.id)
                    setGenerated(false)
                  }}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    period === p.id ? 'bg-ink text-white' : 'text-ink-tint-40 hover:text-ink',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setGenerated(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet px-5 font-medium text-white transition-colors hover:bg-[#4d3179]"
          >
            <FileText className="h-4 w-4" /> Generate statements
          </button>
        </div>
      </div>

      {!generated ? (
        <div className="mt-6 rounded-xl border border-dashed border-hairline bg-card p-12 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-tint-10">
            <FileText className="h-5 w-5 text-ink-tint-40" />
          </span>
          <p className="font-medium text-ink">No statements generated yet</p>
          <p className="mt-1 text-sm text-ink-tint-40">
            Pick a period and generate to preview {statements.length} donor statements.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-hairline bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-ink-tint-40">Ready to send</p>
              <p className="font-serif text-xl font-semibold text-ink">
                {statements.length} statements · {formatCurrency(grandTotal)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportBatch}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-hairline px-4 font-medium text-ink transition-colors hover:bg-ink-tint-10"
              >
                <Download className="h-4 w-4" /> Export CSV batch
              </button>
              <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet px-4 font-medium text-white transition-colors hover:bg-[#4d3179]">
                <Mail className="h-4 w-4" /> Email all
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-hairline bg-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-ink-tint-40">
                  <th className="px-4 py-3 font-medium">Donor</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 text-right font-medium">Gifts</th>
                  <th className="px-4 py-3 text-right font-medium">Total given</th>
                </tr>
              </thead>
              <tbody>
                {statements.map((d) => (
                  <tr key={d.email} className="border-b border-hairline last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{d.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-tint-40">{d.email}</td>
                    <td className="px-4 py-3 text-right text-ink">{d.gifts}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink">
                      {formatCurrency(d.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
