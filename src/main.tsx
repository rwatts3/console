import * as React from 'react' // tslint:disable-line
import * as Relay from 'react-relay'
import * as ReactDOM from 'react-dom'
import { default as useRelay } from 'react-router-relay'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import routes from './routes'
import {updateNetworkLayer} from './utils/relay'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import * as thunk from 'redux-thunk'

import {
  reduceGettingStartedState,
  fetchGettingStartedState,
} from './reducers/GettingStartedState'

import loadAnalytics from './utils/analytics'

import './utils/polyfils'

loadAnalytics()

updateNetworkLayer()

browserHistory.listen(() => {
  analytics.page()
})

const store = createStore(reduceGettingStartedState, applyMiddleware(thunk.default))
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
  document.getElementById('root'))
