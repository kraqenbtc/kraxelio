export const getSecondsDifference = (timestamp: string, currentTime: Date) => {
  const date = new Date(timestamp)
  return Math.floor((currentTime.getTime() - date.getTime()) / 1000)
}

export const formatRelativeTime = (seconds: number) => {
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
} 