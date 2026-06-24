'use client'

import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import {
  transactions,
  funds,
  fundName,
  methodLabel,
  frequencyLabel,
  formatCurrency,
  formatDate,
} from '@/lib/yahab-data'
import { cn } from '@/lib/utils'

const RANGES = [
  { id: '7', label: '7 days' },
  { id: '30', label: '30 days' },
  { id: '90', label: '90 days' },
  { id: 'all', label: 'All' },
]

export function TransactionsView() {
  const [range, setRange] = useState('90')
  const [fundFilter, setFundFilter] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const now = Date.now()
    return transactions.filter((t) => {
      if (fundFilter !== 'all' && t.fundId !== fundFilter) return false
      if (range !== 'all') {
        const days = Number(range)
        if (+new Date(t.createdAt) < now - days * 86400000) return false
      }
      if (query) {
        const q = query.toLowerCase()
        if (
          !t.donorName.toLowerCase().includes(q) &&
          !t.donorEmail.toLowerCase().includes(q) &&
          !t.id.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [range, fundFilter, query])

  const total = filtered
    .filter((t) => t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0)

  function exportCsv() {
    const header = ['Receipt', 'Donor', 'Email', 'Fund', 'Amount', 'Method', 'Frequency', 'Status', 'Source', 'Date']
    const rows = filtered.map((t) => [
      t.id,
      t.donorName,
      t.donorEmail,
      fundName(t.fundId),
      t.amount.toFixed(2),
      methodLabel[t.method],
      frequencyLabel[t.frequency],
      t.status,
      t.sourceSlug ?? '',
      new Date(t.createdAt).toISOString(),
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yahab-transactions-${range}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Transactions</h1>
          <p className="text-ink-tint-40">
            {filtered.length} records · {formatCurrency(total)} received
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-hairline px-4 font-medium text-ink transition-colors hover:bg-ink-tint-10"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-hairline px-3">
          <Search className="h-4 w-4 text-ink-tint-40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search donor, email, or receipt…"
            className="h-11 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-tint-40"
          />
        </div>
        <select
          value={fundFilter}
          onChange={(e) => setFundFilter(e.target.value)}
          className="h-11 rounded-xl border border-hairline bg-card px-3 text-sm text-ink outline-none"
        >
          <option value="all">All funds</option>
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <div className="flex gap-1 rounded-xl border border-hairline p-1">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                range === r.id ? 'bg-ink text-white' : 'text-ink-tint-40 hover:text-ink',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-x-auto rounded-xl border border-hairline bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-ink-tint-40">
              <th className="px-4 py-3 font-medium">Donor</th>
              <th className="px-4 py-3 font-medium">Fund</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              <th className="px-4 py-3 text-right font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id} className="border-b border-hairline last:border-0">
                <td className="px-4 py-3">
                  <span className="block font-medium text-ink">{tx.donorName}</span>
                  <span className="font-mono text-xs text-ink-tint-40">{tx.id}</span>
                </td>
                <td className="px-4 py-3 text-ink">{fundName(tx.fundId)}</td>
                <td className="px-4 py-3 text-ink-tint-40">{methodLabel[tx.method]}</td>
                <td className="px-4 py-3">
                  {tx.sourceSlug ? (
                    <span className="font-mono text-xs text-violet">{tx.sourceSlug}</span>
                  ) : (
                    <span className="text-ink-tint-40">web</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      tx.status === 'completed'
                        ? 'bg-violet-tint-10 text-violet'
                        : 'bg-ink-tint-10 text-ink-tint-40',
                    )}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-ink">
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-4 py-3 text-right text-ink-tint-40">
                  {formatDate(tx.createdAt)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-ink-tint-40">
                  No transactions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
