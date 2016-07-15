import React from 'react'
import Relay from 'react-relay'
import ReactDOM from 'react-dom'
import useRelay from 'react-router-relay'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import routes from './routes'
import { updateNetworkLayer } from './utils/relay'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { gettingStarted, updateGettingStartedState } from './reducers/gettingStarted'

import loadAnalytics from './utils/analytics'

import './utils/polyfils.ts'

loadAnalytics()

updateNetworkLayer()

browserHistory.listen(() => {
  analytics.page()
})

console.log(gettingStarted)

const store = createStore(gettingStarted)
var query = Relay.createQuery(Relay.QL`
  query {
    viewer {
      user {
        gettingStartedStatus
      }
    }
  }`, {})
Relay.Store.primeCache({query}, ({done, error}) => {
  if (done) {
    const data = Relay.Store.readQuery(query)[0]
    console.log(data)
    store.dispatch(updateGettingStartedState(data))
  } else if (error) {
    console.log(error)
  }
})

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
