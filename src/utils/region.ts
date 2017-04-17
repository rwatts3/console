const subscriptionRegions = {
  'EU_WEST_1': 'subscriptions.graph.cool',
  'US_WEST_2': 'subscriptions.us-west-2.graph.cool',
  'AP_NORTHEAST_1': 'subscriptions.ap-northeast-1.graph.cool',
}

export default function getSubscriptionEndpoint(region) {
  const endpoint = subscriptionRegions[region]
  const dev = process.env.NODE_ENV === 'production' ? '' : 'dev.'

  return `wss://${dev}${endpoint}`
}
