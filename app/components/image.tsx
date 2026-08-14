import type { ImgHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  withBackground?: boolean
}

export function Image({ withBackground = true, className, alt, ...props }: Props) {
  return (
    <span
      className={clsx(
        withBackground &&
          'mx-auto mt-8 block rounded-sm bg-linear-to-br from-pink-600 to-indigo-600 p-4 md:w-[90%] md:p-12',
      )}
    >
      <img alt={alt} className={clsx('rounded-md shadow-lg', className)} {...props} />
    </span>
  )
}
