// TS-lint disabled because otherwise React is not defined.
import * as React from 'react' // tslint:disable-line
import * as Relay from 'react-relay'
import * as ReactDOM from 'react-dom'
import { default as useRelay } from 'react-router-relay'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import routes from './routes'
import { updateNetworkLayer } from './utils/relay'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import * as thunk from 'redux-thunk'
import { reduceGettingStartedState } from './reducers/gettingStarted'
import { fetchGettingStartedState } from './actions/gettingStarted'
import { reducePopup } from './reducers/popup'
import { reduceProgress } from './reducers/progressIndicator'
import { reduceData as reduceDataBrowserData } from './reducers/databrowser/data'
import { reduceUI as reduceDataBrowserUI } from './reducers/databrowser/ui'
import { reduceNotification } from './reducers/notification'
import  popupSources from './reducers/popupSources'
import { StateTree } from './types/reducers'
import logger from 'redux-logger'
import * as ReactGA from 'react-ga'
import * as cookiestore from 'cookiestore'

import './utils/polyfils'
import {reduceCodeGeneration} from './reducers/codeGeneration'
require('offline-plugin/runtime').install();


updateNetworkLayer()

// save last referral
if (!cookiestore.has('graphcool_last_referral')) {
  cookiestore.set('graphcool_last_referral', document.referrer)
}

if (__GA_CODE__) {
  ReactGA.initialize(__GA_CODE__)

  browserHistory.listen(() => {
    ReactGA.pageview(window.location.pathname)
  })
}

if (typeof Raven !== 'undefined' && process.env.NODE_ENV === 'production') {
  Raven.config('https://f4b2d5e7865742e290a3bf77849d5e4a@sentry.io/135786').install()
}

const reducers = combineReducers({
  gettingStarted: reduceGettingStartedState,
  popup: reducePopup,
  progressIndicator: reduceProgress,
  notification: reduceNotification,
  databrowser: combineReducers({
    data: reduceDataBrowserData,
    ui: reduceDataBrowserUI,
  }),
  codeGeneration: reduceCodeGeneration,
  popupSources,
})

let middlewares = [thunk.default]

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger())
}

const store = createStore(reducers, compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
))

store.dispatch(fetchGettingStartedState())

ReactDOM.render(
  (
    <Provider store={store}>
      <Router
        forceFetch
        routes={routes}
        environment={Relay.Store}
        render={applyRouterMiddleware(useRelay)}
        history={browserHistory}
      />
    </Provider>
  ),
  document.getElementById('root'),
)
