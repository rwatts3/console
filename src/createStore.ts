import { reduceGettingStartedState } from './reducers/gettingStarted'
import { fetchGettingStartedState } from './actions/gettingStarted'
import { reducePopup } from './reducers/popup'
import { reduceProgress } from './reducers/progressIndicator'
import { reduceData as reduceDataBrowserData } from './reducers/databrowser/data'
import { reduceUI as reduceDataBrowserUI } from './reducers/databrowser/ui'
import { reduceNotification } from './reducers/notification'
import  popupSources from './reducers/popupSources'
import {reduceCodeGeneration} from './reducers/codeGeneration'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import * as thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import createHistoryEnhancer from 'farce/lib/createHistoryEnhancer'
import createMatchEnhancer from 'found/lib/createMatchEnhancer'
import foundReducer from 'found/lib/foundReducer'

import BrowserProtocol from 'farce/lib/BrowserProtocol'
import queryMiddleware from 'farce/lib/queryMiddleware'
import { Resolver } from 'found-relay'
import Matcher from 'found/lib/Matcher'
import routes from './routes'
import FarceActions from 'farce/lib/Actions'
import * as ReactGA from 'react-ga'

export default function () {
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
    found: foundReducer,
  })

  let middlewares = [thunk.default]

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger())
  }

  const store = createStore(reducers, compose(
    createHistoryEnhancer({
      protocol: new BrowserProtocol(),
      middlewares: [queryMiddleware],
    }),
    createMatchEnhancer(
      new Matcher(routes),
    ),
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ))

  store.dispatch(FarceActions.init())
  store.dispatch(fetchGettingStartedState())


  if (__GA_CODE__ && navigator.userAgent !== 'chromeless') {
    ReactGA.initialize(__GA_CODE__)
    ReactGA.pageview(pathname)

    let lastState: any = store.getState()
    store.subscribe(() => {
      console.log('subscribe')
      const state: any = store.getState()
      if (state.found.match.location.key !== lastState.found.match.location.key) {
        const pathname = state.found.match.location.pathname
        ReactGA.pageview(pathname)
      }
    })
  }

  return store
}
