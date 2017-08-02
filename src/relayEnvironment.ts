import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime'
import * as cookiestore from 'cookiestore'
import {GraphQLClient} from 'graphql-request'

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
const isLoggedin = cookiestore.has('graphcool_auth_token') && cookiestore.has('graphcool_customer_id')
const headers = isLoggedin
  ? {
    'Authorization': `Bearer ${cookiestore.get('graphcool_auth_token')}`,
  }
  : undefined

const client = new GraphQLClient(`${__BACKEND_ADDR__}/system`, {
  headers,
})

export function fetchQuery(
  operation,
  variables,
) {

  return client.request(operation.text, variables).then(data => {
    return {data}
  })
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery)

const source = new RecordSource()
const store = new Store(source)

const environment = new Environment({
  network,
  store,
})

export default environment
