export type NotificationLevel = 'success' | 'error' | 'warning' | 'info'
export type ShowNotificationCallback = (message: string, level: NotificationLevel) => void

export interface Query {
  query: string
  variables: string
  date: Date
}

export interface NonScalarValue {
  id: string
  [key: string]: TypedValue
}

export type ScalarValue = number | string | Date | boolean
export type TypedValue = ScalarValue | ScalarValue[] | NonScalarValue | NonScalarValue[]
