import Link from 'next/link'
import { ArrowUpRight, Repeat, Nfc, Users } from 'lucide-react'
import {
  totals,
  byFund,
  weeklyTrend,
  transactions,
  fundName,
  formatCurrency,
  formatDate,
  frequencyLabel,
} from '@/lib/yahab-data'
import { TrendChart, FundChart } from '@/components/admin/dashboard-charts'

export default function AdminDashboard() {
  const t = totals()
  const fundData = byFund()
  const trend = weeklyTrend()
  const recent = transactions.filter((x) => x.status === 'completed').slice(0, 6)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-semibold text-ink">Giving overview</h1>
        <p className="text-ink-tint-40">Last 90 days across Kharis Church.</p>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total received" value={formatCurrency(t.total)} hint={`${t.gifts} gifts`} />
        <Stat
          label="Recurring"
          value={formatCurrency(t.recurring)}
          hint={`${Math.round((t.recurring / t.total) * 100)}% of total`}
          icon={Repeat}
        />
        <Stat
          label="Via tap"
          value={formatCurrency(t.viaTap)}
          hint={`${Math.round((t.viaTap / t.total) * 100)}% of total`}
          icon={Nfc}
        />
        <Stat label="Donors" value={String(t.donors)} hint="unique givers" icon={Users} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHead title="Giving over time" sub="Weekly, recurring vs. one-time" />
          <Legend />
          <TrendChart data={trend} />
        </Card>
        <Card className="lg:col-span-2">
          <CardHead title="By fund" sub="Where gifts are directed" />
          <FundChart data={fundData} />
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <CardHead title="Recent gifts" sub="Latest completed transactions" />
          <Link
            href="/admin/transactions"
            className="flex items-center gap-1 text-sm font-medium text-violet hover:underline"
          >
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-ink-tint-40">
                <th className="pb-2 font-medium">Donor</th>
                <th className="pb-2 font-medium">Fund</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 text-right font-medium">Amount</th>
                <th className="pb-2 text-right font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((tx) => (
                <tr key={tx.id} className="border-b border-hairline last:border-0">
                  <td className="py-3">
                    <span className="block font-medium text-ink">{tx.donorName}</span>
                    <span className="font-mono text-xs text-ink-tint-40">{tx.id}</span>
                  </td>
                  <td className="py-3 text-ink">{fundName(tx.fundId)}</td>
                  <td className="py-3 text-ink-tint-40">{frequencyLabel[tx.frequency]}</td>
                  <td className="py-3 text-right font-medium text-ink">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3 text-right text-ink-tint-40">{formatDate(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function Stat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon?: typeof Repeat
}) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-tint-40">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-violet" />}
      </div>
      <p className="mt-2 font-serif text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-tint-40">{hint}</p>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-hairline bg-card p-5 ${className}`}>{children}</div>
  )
}

function CardHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="text-sm text-ink-tint-40">{sub}</p>
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-3 flex items-center gap-4 text-xs text-ink-tint-40">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-violet" /> Recurring
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-ink" /> One-time
      </span>
    </div>
  )
}
