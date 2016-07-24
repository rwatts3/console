export type NotificationLevel = 'success' | 'error' | 'warning' | 'info'
export type ShowNotificationCallback = (message: string, level: NotificationLevel) => void
