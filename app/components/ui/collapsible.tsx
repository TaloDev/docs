'use client'
import * as Primitive from '@radix-ui/react-collapsible'
import { cn } from 'cnfast'
import * as React from 'react'
import { useEffect, useState } from 'react'

export const Collapsible = Primitive.Root

export const CollapsibleTrigger = Primitive.CollapsibleTrigger

export function CollapsibleContent({
  children,
  ...props
}: React.ComponentProps<typeof Primitive.CollapsibleContent>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Primitive.CollapsibleContent
      {...props}
      className={cn(
        'overflow-hidden',
        mounted &&
          'data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down',
        props.className,
      )}
    >
      {children}
    </Primitive.CollapsibleContent>
  )
}

export type CollapsibleProps = Primitive.CollapsibleProps
export type CollapsibleContentProps = Primitive.CollapsibleContentProps
export type CollapsibleTriggerProps = Primitive.CollapsibleTriggerProps
