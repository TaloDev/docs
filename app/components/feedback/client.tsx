'use client'
import { cva } from 'class-variance-authority'
import { cn } from 'cnfast'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { type SyntheticEvent, useState } from 'react'
import type { ActionResponse, PageFeedback } from './schema'
import { buttonVariants } from '../ui/button'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'

const rateButtonVariants = cva(
  'inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm [&_svg]:size-4 cursor-pointer transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground disabled:cursor-not-allowed',
  {
    variants: {
      active: {
        true: 'bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current',
        false: 'text-fd-muted-foreground',
      },
    },
  },
)

export function Feedback({
  onSendAction,
}: {
  onSendAction: (feedback: PageFeedback) => Promise<ActionResponse>
}) {
  const [opinion, setOpinion] = useState<'good' | 'bad' | null>(null)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function submit(e?: SyntheticEvent) {
    if (opinion == null) {
      return
    }

    const feedback: PageFeedback = {
      url: location.href,
      opinion,
      message,
    }

    void onSendAction(feedback)
    setSubmitted(true)

    e?.preventDefault()
  }

  return (
    <Collapsible open={opinion !== null || submitted} className='border-y py-3'>
      {submitted ? (
        <p className='flex min-h-9.5 items-center text-sm font-medium'>Thanks for your feedback!</p>
      ) : (
        <>
          <div className='flex flex-row items-center gap-2'>
            <p className='text-sm font-medium pe-2'>Did you find this page helpful?</p>
            <button
              className={cn(
                rateButtonVariants({
                  active: opinion === 'good',
                }),
              )}
              onClick={() => {
                setOpinion('good')
              }}
            >
              <ThumbsUp />
              Yes
            </button>
            <button
              className={cn(
                rateButtonVariants({
                  active: opinion === 'bad',
                }),
              )}
              onClick={() => {
                setOpinion('bad')
              }}
            >
              <ThumbsDown />
              No
            </button>
          </div>
          <CollapsibleContent className='mt-3'>
            <form className='flex flex-col gap-3' onSubmit={submit}>
              <textarea
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='border rounded-lg bg-fd-secondary text-fd-secondary-foreground p-3 resize-none focus-visible:outline-none placeholder:text-fd-muted-foreground'
                placeholder='Add any additional feedback (optional)'
                onKeyDown={(e) => {
                  if (!e.shiftKey && e.key === 'Enter') {
                    submit(e)
                  }
                }}
              />
              <button
                type='submit'
                className={cn(buttonVariants({ color: 'outline' }), 'w-fit px-3')}
              >
                Submit
              </button>
            </form>
          </CollapsibleContent>
        </>
      )}
    </Collapsible>
  )
}
