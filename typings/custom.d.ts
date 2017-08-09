declare module 'graphql'
declare module 'graphql/*'
declare module 'react-datetime'
declare module 'styled-components' // https://github.com/styled-components/styled-components/issues/89

interface Window {
  devToolsExtension?: () => any
  Intercom: any
}

import 'react'

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean
    global?: boolean
  }
  interface HTMLProps<T> {
    jsx?: boolean
    global?: boolean
  }
}

declare global {
  var __BACKEND_ADDR__: string
  var Raven: any
  var Intercom: any
  var Stripe: any
  var analytics: any
  var __EXAMPLE_ADDR__: string
  var __SUBSCRIPTIONS_EU_WEST_1__: any
  var __SUBSCRIPTIONS_US_WEST_2__: any
  var __SUBSCRIPTIONS_AP_NORTHEAST_1__: any
  var __HEARTBEAT_ADDR__: string
  var __INTERCOM_ID__: string
  var __STRIPE_PUBLISHABLE_KEY__: string
  var __CLI_AUTH_TOKEN_ENDPOINT__: string
  var __METRICS_ENDPOINT__: string
  var __GA_CODE__: string
  var __AUTH0_DOMAIN__: string
  var __AUTH0_CLIENT_ID__: string
  var graphcoolAlert: any
  var graphcoolConfirm: any
  var graphcoolNotification: any
  type InjectedFoundRouter = any
  type FoundRouterRoute = any
}


