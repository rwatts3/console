import * as React from 'react'
import {Icon} from 'graphcool-styles'
import {PricingPlan} from '../../../types/types'

interface Props {
  maxNodes: number
  usedNodesPerDay?: number[]

  maxMB: number
  currentMB: number

  plan: PricingPlan
  additionalCosts: string

}

export default class NodeUsageIndicator extends React.Component<Props, {}> {

  maxNodeLineY = 100

  render() {
    const columnHeights = this.calculateColumnHeights()

    const today = new Date()
    const dd = today.getDate()
    const mm = today.getMonth()+1
    const yyyy = today.getFullYear()
    const todayString = mm + '/' + dd + '/' + yyyy

    const maxString = '/ ' + this.props.maxMB + ' MB Database (Date: ' + todayString + ')'
    return (
      <div className='flex flexColumn'>
        <div className='columns'>
          <style jsx={true}>{`

          .columns {
            @p: .flex, .itemsEnd, .relative;
            height: 160px;
          }

          .column {
            @p: .bgBlue, .br2, .mr4;
            width: 20px;
          }

          .circularTodayIndicator {
            @p: .bgBlue, .br100, .hS06, .wS06, .mt4, .mr4;
            margin-bottom: -10px;
          }

        `}</style>
          {columnHeights.map((height, i) => {

            if (i == columnHeights.length - 1) {
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
            <div className='ml6 blue f14 fw6'>{this.props.currentMB}</div>
            <div className='ml6 black50 f14'>{maxString}</div>
          </div>
          <div className='f14 fw6 blue'>{'+ $' + this.props.additionalCosts}</div>
        </div>
      </div>
    )
  }

  private calculateColumnHeights = (): number[] => {
    const {maxNodes} = this.props
    const heights = this.props.usedNodesPerDay.map(usage => {
      const currentValue = usage / maxNodes
      return currentValue * this.maxNodeLineY
    })
    return heights
  }

}
