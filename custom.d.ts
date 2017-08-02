declare module 'react-router'
declare module 'graphql'
declare module 'graphql/*'
declare module 'react-datetime'
declare module 'styled-components' // https://github.com/styled-components/styled-components/issues/89

declare const Raven: any
declare const Intercom: any
declare const Stripe: any
declare const analytics: any
declare const __BACKEND_ADDR__: string
declare const __EXAMPLE_ADDR__: string
declare const __SUBSCRIPTIONS_EU_WEST_1__: any
declare const __SUBSCRIPTIONS_US_WEST_2__: any
declare const __SUBSCRIPTIONS_AP_NORTHEAST_1__: any
declare const __HEARTBEAT_ADDR__: string
declare const __INTERCOM_ID__: string
declare const __STRIPE_PUBLISHABLE_KEY__: string
declare const __CLI_AUTH_TOKEN_ENDPOINT__: string
declare const __METRICS_ENDPOINT__: string
declare const __GA_CODE__: string
declare const __AUTH0_DOMAIN__: string
declare const __AUTH0_CLIENT_ID__: string
declare const graphcoolAlert: any
declare const graphcoolConfirm: any

interface Window {
  devToolsExtension?: () => any
  Intercom: any
}

import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
  interface HTMLProps<T> {
    jsx?: boolean
    global?: boolean
  }
}
