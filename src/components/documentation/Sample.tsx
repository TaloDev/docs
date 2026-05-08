import CodeBlock from '@theme/CodeBlock'
import { useState } from 'react'
import type { Sample as SampleType } from './useServiceDocs'
import styles from './Sample.module.css'

export function Sample({ sample }: { sample: SampleType }) {
  const [shown, setShown] = useState(false)

  const stringified = JSON.stringify(sample.sample, null, 2)
  const content = stringified.replaceAll('"/*', '/*').replaceAll('*/"', '*/')

  return (
    <>
      <div className={styles.sampleTitleContainer}>
        <h4>{sample.title}</h4>
        <button type='button' onClick={() => setShown(!shown)}>
          {shown ? 'Hide' : 'Show'}
        </button>
      </div>

      <CodeBlock language='javascript' showLineNumbers>
        {shown ? content : '{ ... }'}
      </CodeBlock>
    </>
  )
}
