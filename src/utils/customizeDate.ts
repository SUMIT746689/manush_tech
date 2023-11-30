export const customizeDate = (date: string) => {
  if (typeof date !== 'string') return '';
  const dateObj = new Date(date)
  const formateDate_ = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })
  return formateDate_.format(dateObj)
}

export const customizeDateWithTime = (date: string) => {
  if (typeof date !== 'string') return '';
  const dateObj = new Date(date)
  const formateDate_ = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium',timeStyle:"short" })
  return formateDate_.format(dateObj)
}