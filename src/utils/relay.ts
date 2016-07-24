import { injectNetworkLayer, DefaultNetworkLayer, Transaction } from 'react-relay'
import { ShowNotificationCallback } from '../types/utils'
import * as cookiestore from './cookiestore'

export function updateNetworkLayer (): void {
  const token = cookiestore.get('graphcool_token')
  const headers = token ? {
    'Authorization': `Bearer ${token}`,
    'X-GraphCool-Source': 'dashboard:relay',
  } : null
  const api = `${__BACKEND_ADDR__}/api`
  const layer = new DefaultNetworkLayer(api, { headers, retryDelays: [] })

  injectNetworkLayer(layer)
}

export function onFailureShowNotification (
  transaction: Transaction,
  showNotification: ShowNotificationCallback
): void {
  const { errors } = (transaction.getError() as any).source
  errors.forEach((error) => showNotification(error.message, 'error'))
}
