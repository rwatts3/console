const subscriptionRegions = {
  'EU_WEST_1': __SUBSCRIPTIONS_EU_WEST_1__,
  'US_WEST_2': __SUBSCRIPTIONS_US_WEST_1__,
  'AP_NORTHEAST_1': __SUBSCRIPTIONS_AP_NORTHEAST_1__,
}

export default function getSubscriptionEndpoint(region) {
  const endpoint = subscriptionRegions[region]
  const dev = process.env.NODE_ENV === 'production' ? '' : 'dev.'

  return `${dev}${endpoint}`
}
