import { twMerge } from 'tailwind-merge'

type ButtonProps = React.ComponentPropsWithoutRef<'button'>
export default function Button(props: ButtonProps) {
  const { children, className, ...rest } = props
  return (
    <button
      className={twMerge(
        'w-[140px] h-[45px] bg-[var(--color-main-navy)] text-[var(--color-white)] rounded-[10px] text-base cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
