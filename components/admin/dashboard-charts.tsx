'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'

const INK = '#161b33'
const VIOLET = '#5b3a8e'
const TINT = '#9a9db3'
const HAIRLINE = '#dedfe6'

const money = (n: number) =>
  '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-hairline bg-card p-3 text-sm">
      <p className="mb-1 font-medium text-ink">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-ink-tint-40">
          <span className="text-ink">{p.name}:</span> {money(p.value)}
        </p>
      ))}
    </div>
  )
}

export function TrendChart({
  data,
}: {
  data: { week: string; recurring: number; oneTime: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={HAIRLINE} />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tick={{ fill: TINT, fontSize: 12 }}
        />
        <YAxis
          tickFormatter={money}
          tickLine={false}
          axisLine={false}
          tick={{ fill: TINT, fontSize: 12 }}
          width={56}
        />
        <Tooltip content={<TooltipBox />} cursor={{ fill: '#e8e9ee', opacity: 0.5 }} />
        <Bar dataKey="oneTime" name="One-time" stackId="a" fill={INK} radius={[0, 0, 0, 0]} />
        <Bar dataKey="recurring" name="Recurring" stackId="a" fill={VIOLET} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function FundChart({ data }: { data: { fund: string; amount: number }[] }) {
  const palette = [VIOLET, INK, '#9a9db3', '#b9a4d6']
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} stroke={HAIRLINE} />
        <XAxis
          type="number"
          tickFormatter={money}
          tickLine={false}
          axisLine={false}
          tick={{ fill: TINT, fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="fund"
          tickLine={false}
          axisLine={false}
          tick={{ fill: INK, fontSize: 13 }}
          width={90}
        />
        <Tooltip content={<TooltipBox />} cursor={{ fill: '#e8e9ee', opacity: 0.5 }} />
        <Bar dataKey="amount" name="Given" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={palette[i % palette.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
