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
    const color = this.barColor(1)
    return (
      <div className='flex flexColumn'>
        <div className='columns'>
          <style jsx={true}>{`

          .columns {
            @p: .flex, .itemsEnd, .relative;
            height: 160px;
          }

          .column {
            @p: .br2, .mr4, .bb;
            width: 20px;
          }

          .circularTodayIndicator {
            @p: .br100, .hS06, .wS06, .mt4, .mr4;
            margin-bottom: -10px;
          }

        `}</style>
          {columnHeights.map((height, i) => {
            if (i === columnHeights.length - 1) {
              return (
                <div key={i} className='flex flexColumn itemsCenter'>
                  <div
                    className='column'
                    style={{
                      height: height + 'px',
                      backgroundColor: color,
                      borderColor: color,
                    }}
                  />
                  <div
                    className='circularTodayIndicator'
                    style={{backgroundColor: color}}
                  />
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
              src={this.icon()}
              width={20}
              height={20}
            />
            <div
              className={`ml6 f14 fw6`}
              style={{color: color}}
            >{this.props.usedStoragePerDay.reduce((a, b) => a + b)} MB</div>
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

  private barColor = (opacity: number) => {
    if (this.props.plan.includes('free')) {
      const maxStorage = billingInfo[this.props.plan].maxStorage
      const warningThreshold = maxStorage - 25
      const currentlyUsedStorage = this.props.usedStoragePerDay[this.props.usedStoragePerDay.length - 1]
      if (currentlyUsedStorage > maxStorage) {
        return `rgba(242,92,84,${opacity})`
      } else if (currentlyUsedStorage > warningThreshold) {
        return `rgba(207,92,54,${opacity})`
      } else {
        return `rgba(39,174,96,${opacity})`
      }
    }
    return `rgba(42,126,210,${opacity})`
  }

  private icon = () => {
    if (this.props.plan.includes('free')) {
      const maxStorage = billingInfo[this.props.plan].maxStorage
      const warningThreshold = maxStorage - 25
      const currentlyUsedStorage = this.props.usedStoragePerDay[this.props.usedStoragePerDay.length - 1]
      if (currentlyUsedStorage > maxStorage) {
        return require('../../../assets/icons/nodes_red.svg')
      } else if (currentlyUsedStorage > warningThreshold) {
        return require('../../../assets/icons/nodes_orange.svg')
      } else {
        return require('../../../assets/icons/nodes_green.svg')
      }
    }
    return require('../../../assets/icons/nodes_blue.svg')
  }

}
