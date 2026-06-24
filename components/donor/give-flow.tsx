'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  CreditCard,
  Landmark,
  Apple,
  Smartphone,
  Repeat,
} from 'lucide-react'
import {
  funds,
  fundName,
  formatCurrency,
  methodLabel,
  type Frequency,
  type PaymentMethod,
} from '@/lib/yahab-data'
import { cn } from '@/lib/utils'

type Step = 'amount' | 'payment' | 'confirm' | 'done'

const PRESETS = [25, 50, 100, 250, 500]
const FEE_RATE = 0.029
const FEE_FIXED = 0.3

const METHODS: {
  id: PaymentMethod
  label: string
  hint: string
  icon: typeof CreditCard
}[] = [
  { id: 'card', label: 'Card / ACH', hint: 'Credit, debit, or bank transfer', icon: CreditCard },
  { id: 'apple_pay', label: 'Apple Pay', hint: 'Pay with Face ID or Touch ID', icon: Apple },
  { id: 'google_pay', label: 'Google Pay', hint: 'Pay with your Google account', icon: Smartphone },
  { id: 'ach', label: 'Direct bank transfer', hint: 'Lower fees for large gifts', icon: Landmark },
]

const STEPS: { id: Step; label: string }[] = [
  { id: 'amount', label: 'Amount' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirm', label: 'Confirm' },
]

export function GiveFlow({
  initialFund = 'tithe',
  source,
}: {
  initialFund?: string
  source?: string | null
}) {
  const [step, setStep] = useState<Step>('amount')
  const [amount, setAmount] = useState<number>(100)
  const [custom, setCustom] = useState('')
  const [fundId, setFundId] = useState(funds.some((f) => f.id === initialFund) ? initialFund : 'tithe')
  const [frequency, setFrequency] = useState<Frequency>('one_time')
  const [coverFees, setCoverFees] = useState(true)
  const [method, setMethod] = useState<PaymentMethod>('card')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const fee = useMemo(() => Math.round((amount * FEE_RATE + FEE_FIXED) * 100) / 100, [amount])
  const charged = coverFees ? Math.round((amount + fee) * 100) / 100 : amount
  const receiptNo = useMemo(
    () => 'YHB-' + Math.random().toString(36).slice(2, 7).toUpperCase() + '-' + new Date().getFullYear(),
    [],
  )

  const canContinueAmount = amount >= 1
  const canConfirm = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email)

  const stepIndex = STEPS.findIndex((s) => s.id === step)

  function setPreset(v: number) {
    setAmount(v)
    setCustom('')
  }
  function setCustomAmount(v: string) {
    setCustom(v)
    const n = parseFloat(v)
    setAmount(Number.isFinite(n) ? n : 0)
  }

  /* ----------------------------- SUCCESS STATE ----------------------------- */
  if (step === 'done') {
    return (
      <div className="mx-auto w-full max-w-md px-5 py-12">
        <div className="rounded-2xl border border-hairline bg-card p-8 text-center">
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-violet-tint-10">
            <Check className="h-7 w-7 text-violet" strokeWidth={2.5} />
          </span>
          <h1 className="font-serif text-3xl font-semibold text-ink">Gift received</h1>
          <p className="mt-2 text-pretty leading-relaxed text-ink-tint-40">
            Thank you, {name.split(' ')[0] || 'friend'}. A receipt is on its way to{' '}
            <span className="text-ink">{email}</span>.
          </p>

          <dl className="mt-7 space-y-3 rounded-xl border border-hairline p-5 text-left text-sm">
            <Row label="Gift" value={formatCurrency(amount)} />
            <Row label="Fund" value={fundName(fundId)} />
            <Row
              label="Frequency"
              value={frequency === 'one_time' ? 'One-time' : frequency === 'weekly' ? 'Weekly' : 'Monthly'}
            />
            {coverFees && <Row label="Fees covered" value={formatCurrency(fee)} />}
            <Row label="Total charged" value={formatCurrency(charged)} strong />
            <div className="flex items-center justify-between border-t border-hairline pt-3">
              <dt className="text-ink-tint-40">Receipt</dt>
              <dd className="font-mono text-[13px] text-ink">{receiptNo}</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-col gap-3">
            <button
              onClick={() => {
                setStep('amount')
                setName('')
                setEmail('')
                setPhone('')
              }}
              className="h-12 rounded-xl bg-violet font-medium text-white transition-colors hover:bg-[#4d3179]"
            >
              Give again
            </button>
            <Link
              href="/"
              className="flex h-12 items-center justify-center rounded-xl border border-hairline font-medium text-ink transition-colors hover:bg-ink-tint-10"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md px-5 py-8">
      {/* Stepper */}
      <Stepper current={stepIndex} />

      {/* ------------------------------ AMOUNT ------------------------------ */}
      {step === 'amount' && (
        // Decision moment: solid Yahab Ink background (gradient intentionally omitted)
        <section className="rounded-2xl bg-ink p-6 text-white sm:p-8">
          <p className="text-sm text-[#c4c6d2]">You&apos;re giving to</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {funds.map((f) => (
              <button
                key={f.id}
                onClick={() => setFundId(f.id)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  fundId === f.id
                    ? 'border-violet bg-violet text-white'
                    : 'border-[#2a3155] text-[#c4c6d2] hover:border-violet',
                )}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <label className="text-sm text-[#c4c6d2]">Amount</label>
            <div className="mt-1 flex items-center justify-center">
              <span className="font-serif text-4xl font-semibold text-[#9a9db3]">$</span>
              <input
                inputMode="decimal"
                value={custom !== '' ? custom : amount ? String(amount) : ''}
                onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0"
                aria-label="Gift amount"
                className="w-[5ch] bg-transparent text-center font-serif text-6xl font-bold tracking-tight text-white outline-none placeholder:text-[#3a4168]"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={cn(
                  'rounded-lg border py-2 text-sm font-medium transition-colors',
                  amount === p && custom === ''
                    ? 'border-violet bg-violet text-white'
                    : 'border-[#2a3155] text-[#c4c6d2] hover:border-violet',
                )}
              >
                ${p}
              </button>
            ))}
          </div>

          {/* Frequency */}
          <div className="mt-7">
            <p className="mb-2 text-sm text-[#c4c6d2]">Frequency</p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ['one_time', 'One-time'],
                  ['weekly', 'Weekly'],
                  ['monthly', 'Monthly'],
                ] as [Frequency, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setFrequency(id)}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-colors',
                    frequency === id
                      ? 'border-violet bg-violet text-white'
                      : 'border-[#2a3155] text-[#c4c6d2] hover:border-violet',
                  )}
                >
                  {id !== 'one_time' && <Repeat className="h-3.5 w-3.5" />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!canContinueAmount}
            onClick={() => setStep('payment')}
            className="mt-8 h-12 w-full rounded-xl bg-violet font-medium text-white transition-colors hover:bg-[#4d3179] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </section>
      )}

      {/* ------------------------------ PAYMENT ----------------------------- */}
      {step === 'payment' && (
        <section>
          <h1 className="font-serif text-2xl font-semibold text-ink">How would you like to give?</h1>
          <p className="mt-1 text-sm text-ink-tint-40">
            Giving {formatCurrency(amount)} to {fundName(fundId)}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {METHODS.map((m) => {
              const selected = method === m.id
              const Icon = m.icon
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    'flex items-center gap-4 rounded-xl border p-4 text-left transition-colors',
                    selected
                      ? 'border-violet bg-violet-tint-10'
                      : 'border-hairline bg-card hover:border-ink-tint-40',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      selected ? 'bg-violet text-white' : 'bg-ink-tint-10 text-ink',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium text-ink">{m.label}</span>
                    <span className="block text-sm text-ink-tint-40">{m.hint}</span>
                  </span>
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border',
                      selected ? 'border-violet bg-violet' : 'border-hairline',
                    )}
                  >
                    {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </span>
                </button>
              )
            })}
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-hairline p-4">
            <input
              type="checkbox"
              checked={coverFees}
              onChange={(e) => setCoverFees(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#5b3a8e]"
            />
            <span className="text-sm">
              <span className="font-medium text-ink">Cover the {formatCurrency(fee)} processing fee</span>
              <span className="block text-ink-tint-40">
                So 100% of your {formatCurrency(amount)} reaches Kharis Church.
              </span>
            </span>
          </label>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep('amount')}
              className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-hairline px-5 font-medium text-ink transition-colors hover:bg-ink-tint-10"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setStep('confirm')}
              className="h-12 flex-1 rounded-xl bg-violet font-medium text-white transition-colors hover:bg-[#4d3179]"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {/* ------------------------------ CONFIRM ----------------------------- */}
      {step === 'confirm' && (
        <section>
          <h1 className="font-serif text-2xl font-semibold text-ink">Almost there</h1>
          <p className="mt-1 text-sm text-ink-tint-40">We need your details to send a receipt.</p>

          <div className="mt-6 space-y-4">
            <Field label="Full name" required>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Tesfaye"
                className="h-12 w-full rounded-xl border border-hairline px-4 text-ink outline-none transition-colors focus:border-violet"
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-hairline px-4 text-ink outline-none transition-colors focus:border-violet"
              />
            </Field>
            <Field label="Phone (optional)">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="h-12 w-full rounded-xl border border-hairline px-4 text-ink outline-none transition-colors focus:border-violet"
              />
            </Field>
          </div>

          <dl className="mt-6 space-y-3 rounded-xl border border-hairline p-5 text-sm">
            <Row label="Gift" value={formatCurrency(amount)} />
            <Row label="Fund" value={fundName(fundId)} />
            <Row label="Payment" value={methodLabel[method]} />
            <Row
              label="Frequency"
              value={frequency === 'one_time' ? 'One-time' : frequency === 'weekly' ? 'Weekly' : 'Monthly'}
            />
            {coverFees && <Row label="Fees covered" value={formatCurrency(fee)} />}
            <div className="flex items-center justify-between border-t border-hairline pt-3">
              <dt className="text-ink-tint-40">Total today</dt>
              <dd className="font-serif text-lg font-semibold text-ink">{formatCurrency(charged)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep('payment')}
              className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-hairline px-5 font-medium text-ink transition-colors hover:bg-ink-tint-10"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {/* Signal Red — reserved exclusively for completing a gift */}
            <button
              disabled={!canConfirm}
              onClick={() => setStep('done')}
              className="h-12 flex-1 rounded-xl bg-signal font-semibold text-white transition-colors hover:bg-[#ad2a28] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Give {formatCurrency(charged)}
            </button>
          </div>
          {source && (
            <p className="mt-4 text-center font-mono text-xs text-ink-tint-40">
              source: {source}
            </p>
          )}
        </section>
      )}
    </div>
  )
}

function Stepper({ current }: { current: number }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                i < current
                  ? 'bg-violet text-white'
                  : i === current
                    ? 'border border-violet text-violet'
                    : 'border border-hairline text-ink-tint-40',
              )}
            >
              {i < current ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={cn(
                'text-sm font-medium',
                i <= current ? 'text-ink' : 'text-ink-tint-40',
              )}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <span className={cn('h-px w-6', i < current ? 'bg-violet' : 'bg-hairline')} />
          )}
        </div>
      ))}
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-tint-40">{label}</dt>
      <dd className={cn(strong ? 'font-semibold text-ink' : 'text-ink')}>{value}</dd>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-ink-tint-40"> *</span>}
      </span>
      {children}
    </label>
  )
}
