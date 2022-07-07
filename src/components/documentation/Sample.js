import React, { useState } from 'react'
import CodeBlock from '@theme/CodeBlock'
import styles from './Sample.module.css'

export default function Sample({ sample }) {
  const [shown, setShown] = useState(false)

  const stringified = JSON.stringify(sample.sample, null, 2)
  const content = stringified.replaceAll('"/*', '/*').replaceAll('*/"', '*/')

  return (
    <>
      <div className={styles.sampleTitleContainer}>
        <h4>{sample.title}</h4>
        <button
          type='button'
          onClick={() => setShown(!shown)}
        >
          {shown ? 'Hide' : 'Show'}
        </button>
      </div>

      <CodeBlock
        language='json'
        showLineNumbers
      >
        {shown ? content : '{ ... }'}
      </CodeBlock>
    </>
  )
}
