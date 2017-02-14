import * as React from 'react'
import {Icon} from 'graphcool-styles'
import {PricingPlan} from '../../../types/types'
import {todayString} from '../../../utils/utils'
import {billingInfo} from './billing_info'

interface Props {
  plan: PricingPlan
  usedStoragePerDay?: number[]
  additionalCosts: number
}

export default class NodeUsageIndicator extends React.Component<Props, {}> {

  maxNodeLineY = 100

  render() {
    const columnHeights = this.calculateColumnHeights()

    const today = todayString()

    const maxMB = billingInfo[this.props.plan].maxStorage

    const maxString = '/ ' + maxMB + ' MB Database (Date: ' + today + ')'
    return (
      <div className='flex flexColumn'>
        <div className='columns'>
          <style jsx={true}>{`

          .columns {
            @p: .flex, .itemsEnd, .relative;
            height: 160px;
          }

          .column {
            @p: .bgBlue, .br2, .mr4, .bb;
            width: 20px;
            border-color: rgba(42,126,210,1);
          }

          .circularTodayIndicator {
            @p: .bgBlue, .br100, .hS06, .wS06, .mt4, .mr4;
            margin-bottom: -10px;
          }

        `}</style>
          {columnHeights.map((height, i) => {

            if (i === columnHeights.length - 1) {
              return (
                <div key={i} className='flex flexColumn itemsCenter'>
                  <div
                    className='column'
                    style={{height: height + 'px'}}
                  />
                  <div className='circularTodayIndicator'/>
                </div>
              )
            }
            return <div
              className='column'
              style={{height: height + 'px'}}
              key={i}
            />
          })}
          <div
            className='absolute bt bBlack05 w100'
            style={{
            top: '60px',
          }}
          />
        </div>
        <div className='flex itemsCenter justifyBetween mt25'>
          <div className='flex itemsCenter'>
            <Icon
              src={require('../../../assets/icons/nodes_blue.svg')}
              width={20}
              height={20}
            />
            <div className='ml6 blue f14 fw6'>{this.props.usedStoragePerDay.reduce((a, b) => a + b)} MB</div>
            <div className='ml6 black50 f14'>{maxString}</div>
          </div>
          {this.props.additionalCosts > 0 &&
            <div className='f14 fw6 blue'>{'+ $' + this.props.additionalCosts.toFixed(2)}</div>}
        </div>
      </div>
    )
  }

  private calculateColumnHeights = (): number[] => {
    const maxMB = billingInfo[this.props.plan].maxStorage
    const heights = this.props.usedStoragePerDay.map(usage => {
      const currentValue = usage / maxMB
      return currentValue * this.maxNodeLineY
    })
    return heights
  }

}
