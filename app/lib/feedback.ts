import type { ActionResponse, PageFeedback } from '@/components/feedback/schema'

const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL as string | undefined

async function postToDiscord(feedback: PageFeedback) {
  if (!webhookUrl) {
    return
  }
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          fields: [
            { name: 'Page', value: feedback.url },
            {
              name: 'Helpful',
              value: feedback.opinion === 'good' ? '👍' : '👎',
            },
            { name: 'Feedback', value: feedback.message.slice(0, 1024) || '-' },
          ],
        },
      ],
    }),
  })
}

export async function onPageFeedback(feedback: PageFeedback): Promise<ActionResponse> {
  await postToDiscord(feedback)
  return {}
}
