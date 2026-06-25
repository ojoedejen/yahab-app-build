/**
 * The login page needs its own layout so it bypasses the AdminShell + AdminAuthGuard
 * that the parent /app/admin/layout.tsx applies to every other admin route.
 *
 * Next.js App Router lets nested layouts override their parent for specific segments.
 * This file renders only `children` with no shell — clean, full-page login experience.
 */
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
