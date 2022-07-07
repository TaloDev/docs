import React from 'react'
import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'
import Link from '@docusaurus/Link'

const FeatureList = [
  {
    title: 'Unity SDK',
    Svg: require('../../static/img/unity.svg').default,
    unityIcon: true,
    description: (
      <>
        Take full advantage of all of Talo's services including events, players, leaderboards and saves.
      </>
    ),
    link: '/docs/unity/install'
  },
  {
    title: 'Self-hosting',
    Svg: require('../../static/img/tabler-icon-server.svg').default,
    description: (
      <>
        Configure and host Talo on your own servers using Docker and our quickstart examples.
      </>
    ),
    link: '/docs/selfhosting/overview'
  },
  {
    title: 'HTTP reference',
    Svg: require('../../static/img/tabler-icon-world.svg').default,
    description: (
      <>
        Documentation for Talo's available API endpoints and how to use them.
      </>
    ),
    link: '/docs/http/authentication'
  }
]

function Feature({Svg, title, description, link, unityIcon}) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link}>
        <div className={styles.feature}>
          <div className={styles.titleIconWrapper}>
            <Svg className={clsx(styles.featureSvg, { [styles.unityIcon]: unityIcon })} alt={title} />
            <h3>{title}</h3>
          </div>

          <p className={styles.desc}>{description}</p>
        </div>
      </Link>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
