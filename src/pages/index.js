import React from 'react'
import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './index.module.css'
import HomepageFeatures from '../components/HomepageFeatures'

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext()
  return (
    <header className={styles.heroBanner}>
      <div className='container'>
        <h1 className='hero__title'>Talo Game Services</h1>
        <p>An open-source backend for your games.</p>
        <p>Talo is an open-source backend for your game. You can integrate leaderboards, stats, event tracking, Steamworks and more with our Godot plugin or Unity package.</p>
      </div>
    </header>
  )
}

export default function Home() {
  return (
    <Layout
      title='Talo Game Services'
      description='Talo is an open-source backend for your game. You can integrate leaderboards, stats, event tracking, Steamworks and more with our Godot plugin or Unity package.'>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
