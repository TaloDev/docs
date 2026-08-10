import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from 'fumadocs-ui/components/codeblock'
import type { Sample as SampleType } from '@/lib/api-docs'

export function Samples({ samples }: { samples: SampleType[] }) {
  return (
    <CodeBlockTabs defaultValue={samples[0]?.title}>
      <CodeBlockTabsList>
        {samples.map((sample) => (
          <CodeBlockTabsTrigger key={sample.title} value={sample.title}>
            {sample.title}
          </CodeBlockTabsTrigger>
        ))}
      </CodeBlockTabsList>

      {samples.map((sample) => (
        <CodeBlockTab key={sample.title} value={sample.title}>
          <CodeBlock>
            <div dangerouslySetInnerHTML={{ __html: sample.html }} />
          </CodeBlock>
        </CodeBlockTab>
      ))}
    </CodeBlockTabs>
  )
}
