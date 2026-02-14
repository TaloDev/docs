import styles from './ScopeBadges.module.css'

export function ScopeBadges({ scope, read, write }) {
  return (
    <div className={styles.badgesContainer}>
      {read && <Badge scope={`read:${scope}`} />}
      {write && <Badge scope={`write:${scope}`} />}
    </div>
  )
}

function Badge({ scope }) {
  return <code className={styles.badge}>{scope}</code>
}
