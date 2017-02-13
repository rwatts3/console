import * as React from 'react'
import {$v, Icon} from 'graphcool-styles'
import {numberWithCommas, daysInMonth} from '../../../utils/utils'
import {PricingPlan} from '../../../types/types'

interface Props {
  plan: PricingPlan
  currentNumberOfRequests: number
  additionalCosts: string
}

export default class RequestUsageIndicator extends React.Component<Props, {}> {

  render() {

    const maxOperations = 1000000

    const maxString = numberWithCommas(maxOperations)
    const currentNumberOfRequestsString = numberWithCommas(this.props.currentNumberOfRequests)

    const icon = require('../../../assets/icons/operations_blue.svg')

    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @p: .hS16, .mt38, .mb25;
          }

          .indicator {
            background: linear-gradient(to right,
              rgba(42,126,210,1) 0%,
              rgba(42,126,210,1) 50%,
              rgba(42,126,210,.5) 50%,
              rgba(42,126,210,.5) 75%,
              rgba(42,126,210,.1) 75%,
              rgba(42,126,210,.1) 100%);
          }

        `}</style>
        <div
          className='w100 h100 mb10 br2 indicator'
          style={{

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
          <div className='f14 fw6 blue'>{'+ $' + this.props.additionalCosts}</div>
        </div>
        <div
          className='f14 fw6'
          style={{
            color: $v.blue50,
            paddingLeft: '27px',
          }}
        >~{this.calculateEstimatedRequests()} estimated</div>
      </div>
    )
  }

  private calculateEstimatedRequests = () => {
    const today = new Date()
    const dd = today.getDay()
    const mm = today.getMonth()+1
    const yyyy = today.getFullYear()
    const daysInCurrentMonth = daysInMonth(mm, yyyy)
    const avgRequestsPerDay = this.props.currentNumberOfRequests / dd
    const daysLeftInCurrentMonth = daysInCurrentMonth - dd
    const estimateForRestOfMonth = daysLeftInCurrentMonth * avgRequestsPerDay
    return numberWithCommas(this.props.currentNumberOfRequests + estimateForRestOfMonth)
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
