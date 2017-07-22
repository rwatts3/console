import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime'
import * as cookiestore from 'cookiestore'

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(
  operation,
  variables,
) {
  const isLoggedin = cookiestore.has('graphcool_auth_token') && cookiestore.has('graphcool_customer_id')
  const headers = isLoggedin
    ? {
      'Authorization': `Bearer ${cookiestore.get('graphcool_auth_token')}`,
    }
    : undefined

  console.log('fetching query', operation, variables)
  return fetch(`${__BACKEND_ADDR__}/system`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    }, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

export default function createRelayEnvironment() {
  // Create a network layer from the fetch function
  const network = Network.create(fetchQuery)

  const source = new RecordSource()
  const store = new Store(source)

  return new Environment({
    network,
    store,
  })
}
