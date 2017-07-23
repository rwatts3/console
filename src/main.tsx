// TS-lint disabled because otherwise React is not defined.
import 'babel-polyfill'
import * as React from 'react' // tslint:disable-line
// import * as Relay from 'react-relay/classic'
import * as ReactDOM from 'react-dom'
// import { default as useRelay } from 'found-relay'
// import { Router, browserHistory, applyRouterMiddleware } from 'found'
import { Provider } from 'react-redux'
import routes from './routes'
import { updateNetworkLayer } from './utils/relay'
import createFarceRouter from 'found/lib/createFarceRouter';

/* Found / Relay Imports */
import BrowserProtocol from 'farce/lib/BrowserProtocol'
import queryMiddleware from 'farce/lib/queryMiddleware'
import createConnectedRouter from 'found/lib/createConnectedRouter';
import createRender from 'found/lib/createRender'
import { Resolver } from 'found-relay'

/* End Found / Relay Imports */

import * as ReactGA from 'react-ga'
import * as cookiestore from 'cookiestore'
import 'graphcool-graphiql/graphiql_dark.css'
import './styles/voyager.css'
import './styles/mdn-like.css'
import './utils/polyfils'
import relayEnvironment from './relayEnvironment'
import createStore from './createStore'
require('offline-plugin/runtime').install()

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

// const Router = createFarceRouter({
//   historyProtocol: new BrowserProtocol(),
//   historyMiddlewares: [queryMiddleware],
//   routeConfig: routes,
//
//   render: createRender({}),
// });

ReactDOM.render(
  (
    <Provider store={store}>
      <ConnectedRouter resolver={new Resolver(environment)} />
    </Provider>
  ),
  document.getElementById('root'),
)
