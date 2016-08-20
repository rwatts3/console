import { injectNetworkLayer, DefaultNetworkLayer, Transaction } from 'react-relay'
import { ShowNotificationCallback } from '../types/utils'
import * as cookiestore from './cookiestore'

export function updateNetworkLayer (): void {
  const token = cookiestore.get('graphcool_auth_token')
  const headers = token ? {
    'Authorization': `Bearer ${token}`,
    'X-GraphCool-Source': 'dashboard:relay',
  } : null
  const api = `${__BACKEND_ADDR__}/system`
  const layer = new DefaultNetworkLayer(api, { headers, retryDelays: [] })

  injectNetworkLayer(layer)
}

export function onFailureShowNotification (
  transaction: Transaction,
  showNotification: ShowNotificationCallback
): void {
  const error = transaction.getError() as any
  // NOTE if error returns non-200 response, there is no `source` provided (probably because of fetch)
  if (error.source && error.source.errors) {
    error.source.errors.forEach((error) => showNotification(error.message, 'error'))
  } else {
    console.error(error)
  }
}
