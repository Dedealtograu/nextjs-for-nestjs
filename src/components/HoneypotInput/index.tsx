export function HoneypotInput() {
  return (
    <input
      className='hidden'
      name='dateUpdatedAt'
      type='text'
      autoComplete='new-password'
      tabIndex={-1}
      defaultValue={''}
    />
  )
}
