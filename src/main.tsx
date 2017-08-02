import 'babel-polyfill'
import './styles/codemirror.css'
import 'graphcool-graphiql/graphiql_dark.css'
import './styles/voyager.css'
import './styles/mdn-like.css'
import './utils/polyfils'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/shell/shell'

import RedirectOnMount from './components/RedirectOnMount/RedirectOnMount'
import * as React from 'react' // tslint:disable-lne
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import * as cookiestore from 'cookiestore'
import createConnectedRouter from 'found/lib/createConnectedRouter'
import createRender from 'found/lib/createRender'
import { Resolver } from 'found-relay'
import relayEnvironment from './relayEnvironment'
import createStore from './createStore'
import * as offline from 'offline-plugin/runtime'

// save last referral
if (!cookiestore.has('graphcool_last_referral')) {
  cookiestore.set('graphcool_last_referral', document.referrer)
}

if (process.env.NODE_ENV === 'production') {
  offline.install({
    onUpdateReady: () => offline.applyUpdate(),
    onUpdated: () => {
      if (typeof graphcoolAlert !== 'undefined') {
        graphcoolAlert('There is a new version of the console available. Please refresh.')
      }
    },
  })
}

if (typeof Raven !== 'undefined' && process.env.NODE_ENV === 'production') {
  Raven.config('https://f4b2d5e7865742e290a3bf77849d5e4a@sentry.io/135786').install()
}

const environment = relayEnvironment

const store = createStore()

const ConnectedRouter = createConnectedRouter({
  render: createRender({
    renderError: ({ error }) => (
      <RedirectOnMount to={`/`} />
    ),
  }),
})

ReactDOM.render(
  (
    <Provider store={store}>
      <ConnectedRouter resolver={new Resolver(environment)} />
    </Provider>
  ),
  document.getElementById('root'),
)
