/* @flow */

import { injectNetworkLayer, DefaultNetworkLayer } from 'react-relay'

const api = 'http://localhost:60000/api'

export function updateNetworkLayer (): void {
  const token = window.localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : null
  const layer = new DefaultNetworkLayer(api, { headers })

  injectNetworkLayer(layer)
}

export function saveToken (token: string): void {
  window.localStorage.setItem('token', token)
}
