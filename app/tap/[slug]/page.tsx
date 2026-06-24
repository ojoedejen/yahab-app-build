import { redirect } from 'next/navigation'
import { tapTags } from '@/lib/yahab-data'
import { TapRedirect } from '@/components/donor/tap-redirect'

// GET /tap/:slug — looks up the slug's current destination, "logs" the scan,
// then forwards the donor on with a ?source attribution. In this prototype the
// forwarding happens through a short client interstitial so the tap moment is
// visible; in production this would be an immediate server-side 302 redirect.
export default async function TapPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tag = tapTags.find((t) => t.slug === slug)

  // Unknown or inactive tag → fall back to the generic giving page.
  if (!tag || !tag.active) {
    redirect(`/give?source=${encodeURIComponent(slug)}`)
  }

  return (
    <TapRedirect slug={tag.slug} label={tag.label} destination={tag.destination} />
  )
}
