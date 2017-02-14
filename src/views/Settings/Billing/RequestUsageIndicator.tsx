import * as React from 'react'
import {$v, Icon} from 'graphcool-styles'
import {numberWithCommas, numberWithCommasRounded, daysInMonth} from '../../../utils/utils'
import {PricingPlan} from '../../../types/types'
import {billingInfo} from './billing_info'

interface Props {
  plan: PricingPlan
  currentNumberOfRequests: number
  additionalCosts: number
}

export default class RequestUsageIndicator extends React.Component<Props, {}> {

  render() {

    const maxRequests = billingInfo[this.props.plan].maxRequests
    const maxString = numberWithCommas(maxRequests)
    const currentNumberOfRequestsString = numberWithCommas(this.props.currentNumberOfRequests)
    const icon = require('../../../assets/icons/operations_blue.svg')
    const usedPercent = (this.props.currentNumberOfRequests / billingInfo[this.props.plan].maxRequests) * 100
    const estimatedPercent = (this.calculateEstimatedRequests() / billingInfo[this.props.plan].maxRequests) * 100
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @p: .hS16, .mt38, .mb25;
          }

        `}</style>
        <div
          className='w100 h100 mb10 br2'
          style={{
            background: `linear-gradient(to right,
              rgba(42,126,210,1) 0%,
              rgba(42,126,210,1) ${usedPercent}%,
              rgba(42,126,210,.5) ${usedPercent}%,
              rgba(42,126,210,.5) ${estimatedPercent}%,
              rgba(42,126,210,.1) ${estimatedPercent}%,
              rgba(42,126,210,.1) 100%)`,
        }}></div>
        <div className='flex itemsCenter justifyBetween mt16'>
          <div className='flex itemsCenter'>
            <Icon
              src={icon}
              width={20}
              height={20}
            />
            <div className='ml6 blue f14 fw6'>{currentNumberOfRequestsString}</div>
            <div className='ml6 black50 f14'> / {maxString}</div>
          </div>
          {this.props.additionalCosts > 0 &&
            <div className='f14 fw6 blue'>{'+ $' + this.props.additionalCosts.toFixed(2)}</div>}
        </div>
        <div
          className='f14 fw6'
          style={{
            color: $v.blue50,
            paddingLeft: '27px',
          }}
        >~{numberWithCommasRounded(this.calculateEstimatedRequests(), 0)} estimated</div>
      </div>
    )
  }

  private calculateEstimatedRequests = () => {
    const today = new Date()
    const dd = today.getDate()
    const mm = today.getMonth() + 1
    const yyyy = today.getFullYear()
    const daysInCurrentMonth = daysInMonth(mm, yyyy)

    const avgRequestsPerDay = this.props.currentNumberOfRequests / dd
    const daysLeftInCurrentMonth = daysInCurrentMonth - dd
    const estimateForRestOfMonth = daysLeftInCurrentMonth * avgRequestsPerDay
    return this.props.currentNumberOfRequests + estimateForRestOfMonth
  }

  private estimatedPercentageOfTotal = () => {
    const total = billingInfo[this.props.plan].maxRequests
    const estimated = this.calculateEstimatedRequests()
    const ratio = total / estimated
    return ratio
  }

}

/*
 background: `linear-gradient(to right, #9c9e9f 0%,#f6f6f6 100%);`

 background: `linear-gradient(to right,
 ${$v.green} 0%,
 ${$v.green} ${greenPercentage}%,
 rgba(28,191,50,.15) ${greenPercentage}%,
 rgba(28,191,50,.15) ${greenPercentage + lightGreenPercentage}%,
 rgba(0,0,0,.07) ${greenPercentage + lightGreenPercentage}%,
 rgba(0,0,0,.07) ${greenPercentage + lightGreenPercentage + lightGrayPercentage}%)`,
 */
