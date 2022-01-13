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
        <h1 className='hero__title'>{siteConfig.title}</h1>
        <p>An open-source backend for your games.</p>
        <p>Talo lets you understand your players and cut out the guess-work.</p>
      </div>
    </header>
  )
}

export default function Home() {
  return (
    <Layout
      title='Talo Game Services'
      description='An open-source backend for your games'>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
