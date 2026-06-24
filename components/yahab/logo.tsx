import { cn } from '@/lib/utils'

export function YahabMark({ className }: { className?: string }) {
  // "Light through glass" expressed as a simple violet aperture — no literal religious iconography.
  return (
    <span
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet',
        className,
      )}
      aria-hidden="true"
    >
      <span className="block h-3.5 w-3.5 rounded-[3px] bg-white" />
    </span>
  )
}

export function YahabWordmark({
  className,
  tone = 'ink',
}: {
  className?: string
  tone?: 'ink' | 'light'
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <YahabMark />
      <span
        className={cn(
          'font-serif text-xl font-semibold tracking-tight',
          tone === 'light' ? 'text-white' : 'text-ink',
        )}
      >
        Yahab
      </span>
    </span>
  )
}
