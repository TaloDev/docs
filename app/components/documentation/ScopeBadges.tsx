export function ScopeBadges({
  scope,
  read,
  write,
}: {
  scope: string
  read: boolean
  write: boolean
}) {
  return (
    <div className='my-4 flex items-center gap-2 text-sm font-semibold'>
      {read && <Badge scope={`read:${scope}`} />}
      {write && <Badge scope={`write:${scope}`} />}
    </div>
  )
}

function Badge({ scope }: { scope: string }) {
  return (
    <code className='rounded border border-fd-border bg-fd-muted px-2 py-0.5 text-fd-primary'>
      {scope}
    </code>
  )
}
