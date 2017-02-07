import {PricingPlan, PricingPlanInfo} from '../../../types/types'

// should be: [key: PricingPlan]: PricingPlanInfo
export const billingInfo: { [key: string]: PricingPlanInfo } = {
  'Developer': {
    price: 0,
    maxNodes: 10000,
    maxRequests: 100000,
    maxSeats: 2,
    pricePerThousandAdditionalNodes: -1,
    pricePerThousandAdditionalRequests: -1,
  },
  'Startup': {
    price: 49,
    maxNodes: 100000,
    maxRequests: 1000000,
    maxSeats: 5,
    pricePerThousandAdditionalNodes: 90,
    pricePerThousandAdditionalRequests: 6,
  },
  'Growth': {
    price: 249,
    maxNodes: 1000000,
    maxRequests: 10000000,
    maxSeats: 10,
    pricePerThousandAdditionalNodes: 45,
    pricePerThousandAdditionalRequests: 3,
  },
  'Pro': {
    price: 849,
    maxNodes: 5000000,
    maxRequests: 50000000,
    maxSeats: -1,
    pricePerThousandAdditionalNodes: 30,
    pricePerThousandAdditionalRequests: 2,
  },
  'Enterprise': {
    price: -1,
    maxNodes: -1,
    maxRequests: -1,
    maxSeats: -1,
    pricePerThousandAdditionalNodes: -1,
    pricePerThousandAdditionalRequests: -1,
  },
}
