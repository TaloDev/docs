import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'
import Link from '@docusaurus/Link'

const FeatureList = [
  {
    title: 'Godot plugin',
    Svg: require('../../static/img/godot.svg').default,
    engineIcon: true,
    description: (
      <>
        Build your Godot game faster with our Talo plugin.
      </>
    ),
    link: '/docs/godot/install'
  },
  {
    title: 'Unity package',
    Svg: require('../../static/img/unity.svg').default,
    engineIcon: true,
    description: (
      <>
        Take full advantage of Talo through our convenient Unity package.
      </>
    ),
    link: '/docs/unity/install'
  },
  {
    title: 'API reference',
    Svg: require('../../static/img/tabler-icon-world.svg').default,
    description: (
      <>
        Documentation for Talo's available API endpoints and how to use them.
      </>
    ),
    link: '/docs/http/authentication'
  },
  {
    title: 'Socket reference',
    Svg: require('../../static/img/tabler-icon-topology-bus.svg').default,
    description: (
      <>
        A reference guide for the available Talo socket message types and payloads.
      </>
    ),
    link: '/docs/sockets/intro'
  },
  {
    title: 'Self-hosting',
    Svg: require('../../static/img/tabler-icon-server.svg').default,
    description: (
      <>
        Configure Talo on your own servers using Docker and our quickstart examples.
      </>
    ),
    link: '/docs/selfhosting/overview'
  },
  {
    title: 'Integrations',
    Svg: require('../../static/img/tabler-icon-exchange.svg').default,
    description: (
      <>
        Learn how integrations like Steamworks sync with Talo and how to configure them.
      </>
    ),
    link: '/docs/integrations/steamworks'
  }
]

function Feature({Svg, title, description, link, engineIcon }) {
  return (
    <div>
      <Link to={link}>
        <div className={styles.feature}>
          <div className={styles.titleIconWrapper}>
            <Svg className={clsx(styles.featureSvg, { [styles.engineIcon]: engineIcon })} alt={title} />
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
        <div className={styles.grid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
