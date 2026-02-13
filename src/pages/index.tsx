import Layout from '@theme/Layout'
import HomepageFeatures from '../components/HomepageFeatures'
import styles from './index.module.css'

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className='container'>
        <h1 className='hero__title'>Talo Game Services</h1>
        <p>An open-source backend for your games.</p>
        <p>
          Using Talo, you can integrate leaderboards, stats, event tracking, Steamworks and more
          with our Godot plugin, Unity package or API.
        </p>
      </div>
    </header>
  )
}

export default function Home() {
  return (
    <Layout
      title='Talo Game Services'
      description='Talo is an open-source backend for your game. You can integrate leaderboards, stats, event tracking, Steamworks and more with our Godot plugin or Unity package.'
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
