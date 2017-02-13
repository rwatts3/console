import * as React from 'react'
import RequestUsageIndicator from './RequestUsageIndicator'
import UsedSeats from './Seats'
import NodeUsageIndicator from './NodeUsageIndicator'
import {$v} from 'graphcool-styles'
import {billingInfo} from './billing_info'
import {PricingPlan} from '../../../types/types'

interface Props {
  plan: PricingPlan

  usedSeats: string[]

  lastInvoiceDate: string
  nextInvoiceDate: string

  currentNumberOfRequests: number
  usedNodesPerDay: number[]
}

export default class Usage extends React.Component<Props, {}> {

  render() {

    const maxSeats = 2

    const period = '(' + this.props.nextInvoiceDate + ' - ' + this.props.lastInvoiceDate + ')'

    return (
      <div className='container'>
        <style jsx={true}>{`

          .container {
            @p: .flex, .flexColumn, .ph60;
          }

          .title {
            @p: .black30, .fw6, .f14, .ttu;
          }

        `}</style>
        <div className='title'>{'Usage ' + period}</div>
        <NodeUsageIndicator
          plan='Pro'
          maxNodes={250000}
          usedNodesPerDay={this.props.usedNodesPerDay}
          currentMB={250}
          maxMB={120}
          additionalCosts={this.calculateAdditionalCostsForNodes().toFixed(2)}
        />
        <RequestUsageIndicator
          plan={this.props.plan}
          currentNumberOfRequests={this.props.currentNumberOfRequests}
          additionalCosts={this.calculateAdditionalCostsForRequests().toFixed(2)}
        />
        <div
          className='w100 ttu f14 flex justifyEnd'

        >
          <div className='bt tr pt6'
            style={{
            borderColor: $v.blue50,
            color: $v.blue50,
            width: '200px',
            marginTop: '38px'
          }}
          >
            Overage total <span className='blue fw6 ml6'>  + ${(this.calculateTotalOverage()).toFixed(2)}</span>
          </div>
        </div>
        <UsedSeats
          className='mt25 mb38'
          seats={this.props.usedSeats}
          maxSeats={maxSeats}
        />
      </div>
    )
  }

  private calculateTotalOverage = (): number => {
    return this.calculateAdditionalCostsForNodes() + this.calculateAdditionalCostsForRequests()
  }

  private calculateAdditionalCostsForRequests = () => {
    const pricePerAdditionalRequest = billingInfo[this.props.plan].pricePerThousandAdditionalRequests
    const maxRequests = billingInfo[this.props.plan].maxRequests
    const additionalRequests = maxRequests - this.props.currentNumberOfRequests

    const penaltyFactor = additionalRequests / 1000
    const sum = penaltyFactor * pricePerAdditionalRequest

    const sumInDollars = sum / 100
    return sumInDollars
  }

  private calculateAdditionalCostsForNodes = () => {
    const pricePerAdditionalNode = billingInfo[this.props.plan].pricePerThousandAdditionalNodes
    const maxNodes = billingInfo[this.props.plan].maxNodes
    const sum = this.props.usedNodesPerDay.reduce((acc, usedNodes) => {
      const additionalNodes = maxNodes - usedNodes
      if (additionalNodes > 0) {
        const penaltyFactor = additionalNodes / 1000
        return acc + penaltyFactor * pricePerAdditionalNode
      }
      return acc
    }, 0)
    const sumInDollars = sum / 100
    return sumInDollars
  }

}
