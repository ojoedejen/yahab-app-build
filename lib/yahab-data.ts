// Mock data + types for the Yahab giving platform prototype.
// All data is in-memory and for demonstration only.

export type Fund = {
  id: string
  name: string
  description: string
  active: boolean
}

export type PaymentMethod = 'card' | 'ach' | 'apple_pay' | 'google_pay'

export type Frequency = 'one_time' | 'weekly' | 'monthly'

export type Transaction = {
  id: string
  donorName: string
  donorEmail: string
  fundId: string
  amount: number
  method: PaymentMethod
  frequency: Frequency
  status: 'completed' | 'pending' | 'failed'
  sourceSlug: string | null
  createdAt: string // ISO
}

export type TapTag = {
  id: string
  slug: string
  label: string
  destination: string
  active: boolean
  scansToday: number
  scans30d: number
  updatedAt: string
}

export const funds: Fund[] = [
  { id: 'tithe', name: 'Tithe', description: 'Your regular tithe to Kharis Church', active: true },
  { id: 'offering', name: 'Offering', description: 'General weekly offering', active: true },
  { id: 'missions', name: 'Missions', description: 'Local & global outreach', active: true },
  { id: 'building', name: 'Building Fund', description: 'Sanctuary expansion project', active: true },
]

export const fundName = (id: string) => funds.find((f) => f.id === id)?.name ?? id

export const methodLabel: Record<PaymentMethod, string> = {
  card: 'Card / ACH',
  ach: 'Bank transfer',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
}

export const frequencyLabel: Record<Frequency, string> = {
  one_time: 'One-time',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

const firstNames = ['Sarah', 'Daniel', 'Grace', 'Michael', 'Ruth', 'Caleb', 'Hannah', 'Joseph', 'Naomi', 'Elias', 'Tabitha', 'Samuel', 'Esther', 'Jonah', 'Lydia', 'Aaron']
const lastNames = ['Tesfaye', 'Bekele', 'Johnson', 'Abebe', 'Mengistu', 'Williams', 'Girma', 'Solomon', 'Haile', 'Brown', 'Desta', 'Kebede']

function seededTransactions(): Transaction[] {
  const out: Transaction[] = []
  const methods: PaymentMethod[] = ['card', 'ach', 'apple_pay', 'google_pay']
  const freqs: Frequency[] = ['one_time', 'one_time', 'one_time', 'weekly', 'monthly']
  const slugs = [null, null, 'seat-b12', 'usher-1', 'info-table', null]
  let seed = 7
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  const now = Date.now()
  for (let i = 0; i < 64; i++) {
    const fund = funds[Math.floor(rand() * funds.length)]
    const amount = [25, 50, 75, 100, 150, 200, 250, 500, 1000][Math.floor(rand() * 9)]
    const fn = firstNames[Math.floor(rand() * firstNames.length)]
    const ln = lastNames[Math.floor(rand() * lastNames.length)]
    const daysAgo = Math.floor(rand() * 90)
    out.push({
      id: `txn_${(100000 + i).toString(36)}${Math.floor(rand() * 9000 + 1000)}`,
      donorName: `${fn} ${ln}`,
      donorEmail: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      fundId: fund.id,
      amount,
      method: methods[Math.floor(rand() * methods.length)],
      frequency: freqs[Math.floor(rand() * freqs.length)],
      status: rand() > 0.07 ? 'completed' : 'pending',
      sourceSlug: slugs[Math.floor(rand() * slugs.length)],
      createdAt: new Date(now - daysAgo * 86400000 - Math.floor(rand() * 86400000)).toISOString(),
    })
  }
  return out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export const transactions: Transaction[] = seededTransactions()

export const tapTags: TapTag[] = [
  { id: 't1', slug: 'seat-b12', label: 'Seat back — Row B, Seat 12', destination: '/give', active: true, scansToday: 14, scans30d: 212, updatedAt: '2026-06-21T09:30:00Z' },
  { id: 't2', slug: 'usher-1', label: 'Usher card #1', destination: '/give', active: true, scansToday: 31, scans30d: 488, updatedAt: '2026-06-21T09:30:00Z' },
  { id: 't3', slug: 'info-table', label: 'Info / connect table', destination: '/give?fund=missions', active: true, scansToday: 8, scans30d: 96, updatedAt: '2026-06-18T14:05:00Z' },
  { id: 't4', slug: 'entrance', label: 'Main entrance kiosk', destination: '/give', active: true, scansToday: 22, scans30d: 305, updatedAt: '2026-06-20T11:00:00Z' },
  { id: 't5', slug: 'foyer-event', label: 'Foyer stand — events', destination: '/give?fund=building', active: false, scansToday: 0, scans30d: 41, updatedAt: '2026-05-30T16:20:00Z' },
]

export const formatCurrency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: n % 1 === 0 ? 0 : 2 })

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

// ---- Derived dashboard metrics ----

export function totals() {
  const completed = transactions.filter((t) => t.status === 'completed')
  const total = completed.reduce((s, t) => s + t.amount, 0)
  const recurring = completed.filter((t) => t.frequency !== 'one_time').reduce((s, t) => s + t.amount, 0)
  const oneTime = total - recurring
  const viaTap = completed.filter((t) => t.sourceSlug).reduce((s, t) => s + t.amount, 0)
  return {
    total,
    recurring,
    oneTime,
    viaTap,
    gifts: completed.length,
    donors: new Set(completed.map((t) => t.donorEmail)).size,
  }
}

export function byFund() {
  const completed = transactions.filter((t) => t.status === 'completed')
  return funds.map((f) => ({
    fund: f.name,
    amount: completed.filter((t) => t.fundId === f.id).reduce((s, t) => s + t.amount, 0),
  }))
}

export function weeklyTrend() {
  // last 8 weeks of completed giving
  const completed = transactions.filter((t) => t.status === 'completed')
  const weeks: { week: string; recurring: number; oneTime: number }[] = []
  const now = Date.now()
  for (let w = 7; w >= 0; w--) {
    const start = now - (w + 1) * 7 * 86400000
    const end = now - w * 7 * 86400000
    const inWeek = completed.filter((t) => {
      const d = +new Date(t.createdAt)
      return d >= start && d < end
    })
    weeks.push({
      week: new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      recurring: inWeek.filter((t) => t.frequency !== 'one_time').reduce((s, t) => s + t.amount, 0),
      oneTime: inWeek.filter((t) => t.frequency === 'one_time').reduce((s, t) => s + t.amount, 0),
    })
  }
  return weeks
}
