import clsx from 'clsx'
import { useId } from 'react'

type InputCheckBoxProps = {
  labelText?: string
  type?: 'checkbox'
} & React.ComponentProps<'input'>

export function InputCheckBox({ labelText = '', type = 'checkbox', ...props }: InputCheckBoxProps) {
  const id = useId()

  return (
    <div className='flex items-center gap-3'>
      <input
        {...props}
        className={clsx(
          'w-4',
          'h-4',
          'outline-none',
          'rounded-lg',
          'focus:ring-2',
          'focus:ring-blue-500',
          'transition',
          props.className,
        )}
        id={id}
        type={type}
      />

      {labelText && (
        <label className='text-base' htmlFor={id}>
          {labelText}
        </label>
      )}
    </div>
  )
}
