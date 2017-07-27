import 'babel-polyfill'
import './styles/codemirror.css'
import './styles/graphiql_dark.css'
import './styles/voyager.css'
import './styles/mdn-like.css'
import './utils/polyfils'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/shell/shell'
require('offline-plugin/runtime').install()

import * as React from 'react' // tslint:disable-lne
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import * as ReactGA from 'react-ga'
import * as cookiestore from 'cookiestore'
import createConnectedRouter from 'found/lib/createConnectedRouter'
import createRender from 'found/lib/createRender'
import { Resolver } from 'found-relay'
import relayEnvironment from './relayEnvironment'
import createStore from './createStore'

// save last referral
if (!cookiestore.has('graphcool_last_referral')) {
  cookiestore.set('graphcool_last_referral', document.referrer)
}

if (__GA_CODE__ && navigator.userAgent !== 'chromeless') {
  ReactGA.initialize(__GA_CODE__)

  // TODO reactivate
  // browserHistory.listen(() => {
  //   ReactGA.pageview(window.location.pathname)
  // })
}

if (typeof Raven !== 'undefined' && process.env.NODE_ENV === 'production') {
  Raven.config('https://f4b2d5e7865742e290a3bf77849d5e4a@sentry.io/135786').install()
}

const environment = relayEnvironment

const store = createStore()

const ConnectedRouter = createConnectedRouter({
  render: createRender({
    renderError: ({ error }) => ( // eslint-disable-line react/prop-types
      <div>
        {error.status === 404 ? 'Not found' : 'Error'}
      </div>
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
