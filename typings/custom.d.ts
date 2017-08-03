declare module 'graphql'
declare module 'graphql/*'
declare module 'react-datetime'
declare module 'styled-components' // https://github.com/styled-components/styled-components/issues/89

declare var Raven: any
declare var Intercom: any
declare var Stripe: any
declare var analytics: any
declare var __EXAMPLE_ADDR__: string
declare var __SUBSCRIPTIONS_EU_WEST_1__: any
declare var __SUBSCRIPTIONS_US_WEST_2__: any
declare var __SUBSCRIPTIONS_AP_NORTHEAST_1__: any
declare var __HEARTBEAT_ADDR__: string
declare var __INTERCOM_ID__: string
declare var __STRIPE_PUBLISHABLE_KEY__: string
declare var __CLI_AUTH_TOKEN_ENDPOINT__: string
declare var __METRICS_ENDPOINT__: string
declare var __GA_CODE__: string
declare var __AUTH0_DOMAIN__: string
declare var __AUTH0_CLIENT_ID__: string
declare var graphcoolAlert: any
declare var graphcoolConfirm: any
declare var graphcoolNotification: any

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
}
