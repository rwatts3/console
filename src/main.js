import React from 'react'
import Relay from 'react-relay'
import ReactDOM from 'react-dom'
import useRelay from 'react-router-relay'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import routes from './routes'
import { updateNetworkLayer } from './utils/relay'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import {
  reduceGettingStartedState,
  fetchGettingStartedState,
} from './reducers/GettingStartedState'

import loadAnalytics from './utils/analytics'

import './utils/polyfils.ts'

loadAnalytics()

updateNetworkLayer()

browserHistory.listen(() => {
  analytics.page()
})

const store = createStore(reduceGettingStartedState, applyMiddleware(thunk))
store.dispatch(fetchGettingStartedState())

ReactDOM.render((
  <Provider store={store}>
    <Router
      forceFetch
      routes={routes}
      environment={Relay.Store}
      render={applyRouterMiddleware(useRelay)}
      history={browserHistory}
    />
  </Provider>
), document.getElementById('root'))
