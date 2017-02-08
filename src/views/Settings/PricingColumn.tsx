import * as React from 'react'
import {PricingPlan} from '../../types/types'
import {billingInfo} from './Billing/billing_info'
import {Icon} from 'graphcool-styles'
import {numberWithCommas} from '../../utils/utils'

interface Props {
  plan: PricingPlan
  isCurrentPlan: boolean
  isSelected?: boolean
  className?: string
  onSelectPlan?: Function
}

export default class PricingColumn extends React.Component<Props, {}> {

  render() {

    return (
      <div
        className={`container ${this.props.className || ''}`}
        style={{backgroundColor: this.backgroundColor()}}
      >
        <style jsx={true}>{`
          .container {
            @p: .flex, .flexColumn, .itemsCenter, .pv25, .ph16, .br2;
            width: 170px;
            height: 344px;
          }

          .header {
            @p: .flex, .flexColumn, .itemsCenter,  .bb;
            height: 120px;
          }

        `}</style>

        <div
          className='header'
          style={{borderColor: this.secondaryTextColor()}}
        >
          <div
            className='fw6 f16 ttu'
            style={{color: this.secondaryTextColor()}}
          >
            {this.props.plan}
          </div>
          {this.priceTag()}
        </div>

        <div className='flex'>
          <Icon
            src={this.nodesIcon()}
            width={20}
            height={20}
          />
          <div className='ml6'>
            <div
              className='f16 fw6'
              style={{color: this.primaryTextColor()}}
            >
              {this.numberOfNodes()}
            </div>
            <div
              className='f12'
              style={{color: this.primaryTextColor()}}
            >
              Nodes
            </div>
          </div>
        </div>

        <div className='flex'>
          <Icon
            src={this.requestsIcon()}
            width={20}
            height={20}
          />
          <div className='ml6'>
            <div
              className='f16 fw6'
              style={{color: this.primaryTextColor()}}
            >
              {this.numberOfRequests()}
            </div>
            <div
              className='f12'
              style={{color: this.primaryTextColor()}}
            >
              Operations
            </div>
          </div>
        </div>

        <div className='flex'>
          <Icon
            src={this.seatsIcon()}
            width={20}
            height={20}
          />
          <div
            className='ml6 f16 fw6'
            style={{color: this.primaryTextColor()}}
          >
            {this.numberOfSeats()}
          </div>
          <div
            className='f12'
            style={{color: this.primaryTextColor()}}
          >
            Seats
          </div>
        </div>

        {this.actionButton()}

      </div>
    )
  }

  private actionButton = (): JSX.Element => {
    if (this.props.isCurrentPlan) {
      return (
        <div
          className='f14 fw6 ttu'
          style={{color: this.primaryTextColor()}}
        >Current Plan</div>
      )
    }

    return (
      <div
        className='f14 fw6 ttu buttonShadow bgWhite pointer br2'
        style={{color: this.primaryTextColor()}}
        onClick={() => this.props.onSelectPlan(this.props.plan)}
      >Choose Plan</div>
    )
  }

  private backgroundColor = (): string => {

    if (this.props.isSelected) {
      return 'white'
    }

    if (this.props.isCurrentPlan) {
      return 'rgba(0,0,0,.04)'
    }

    switch (this.props.plan) {
      case 'Developer': return 'rgba(241,143,1,.1)'
      case 'Startup': return 'rgba(28,191,50,.07)'
      case 'Growth': return 'rgba(28,191,50,.07)'
      case 'Pro': return 'rgba(28,191,50,.07)'
      case 'Enterprise': return 'rgba(39,174,96,1)'
      default: return ''
    }
  }

  private numberOfNodes = (): string => {
    const maxNodes = billingInfo[this.props.plan].maxNodes
    return numberWithCommas(maxNodes)
  }

  private numberOfRequests = (): string => {
    const maxRequests = billingInfo[this.props.plan].maxRequests
    return numberWithCommas(maxRequests)
  }

  private numberOfSeats = (): string => {
    const maxSeats = billingInfo[this.props.plan].maxSeats
    if (maxSeats < 0) {
      return '∞'
    }
    return maxSeats.toString()
  }

  private primaryTextColor = (): string => {
    if (this.props.isCurrentPlan) {
      return 'rgba(0,0,0,.5)'
    }

    switch (this.props.plan) {
      case 'Developer': return 'rgba(241,143,1,1)'
      case 'Startup': return 'rgba(39,174,96,1)'
      case 'Growth': return 'rgba(39,174,96,1)'
      case 'Pro': return 'rgba(39,174,96,1)'
      case 'Enterprise': return 'white'
      default: return ''
    }
  }

  private secondaryTextColor = (): string => {
    if (this.props.isCurrentPlan) {
      return 'rgba(0,0,0,.25)'
    }

    switch (this.props.plan) {
      case 'Developer': return 'rgba(241,143,1,.5)'
      case 'Startup': return 'rgba(28,191,50,.5)'
      case 'Growth': return 'rgba(28,191,50,.5)'
      case 'Pro': return 'rgba(28,191,50,.5)'
      case 'Enterprise': return 'rgba(255,255,255,.5)'
      default: return ''
    }
  }

  private priceTag = (): JSX.Element => {
    if (this.props.plan === 'Developer') {
      return (
        <div
          className='mt10 f38 fw3'
          style={{color: this.primaryTextColor()}}
        >
          Free
        </div>
      )
    } else {
      const price = '$' + billingInfo[this.props.plan].price
      return (
        <div className='flex itemsEnd'>
          <div
            className='f38 fw3'
            style={{color: this.primaryTextColor()}}
          >
            {price}
          </div>
          <div
            className='f20'
            style={{color: this.secondaryTextColor()}}
          >
            /mo
          </div>
        </div>
      )
    }
  }

  private nodesIcon = () => {
    if (this.props.isCurrentPlan) {
      const icon = require('../../assets/icons/nodes_gray.svg')
      return icon
    }

    switch (this.props.plan) {
      case 'Developer': return require('../../assets/icons/nodes_orange.svg')
      case 'Startup': return require('../../assets/icons/nodes_green.svg')
      case 'Growth': return require('../../assets/icons/nodes_green.svg')
      case 'Pro': return require('../../assets/icons/nodes_green.svg')
      default: return ''
    }
  }

  private requestsIcon = () => {
    if (this.props.isCurrentPlan) {
      const icon = require('../../assets/icons/requests_gray.svg')
      return icon
    }

    switch (this.props.plan) {
      case 'Developer': return require('../../assets/icons/requests_orange.svg')
      case 'Startup': return require('../../assets/icons/requests_green.svg')
      case 'Growth': return require('../../assets/icons/requests_green.svg')
      case 'Pro': return require('../../assets/icons/requests_green.svg')
      default: return ''
    }
  }

  private seatsIcon = () => {
    if (this.props.isCurrentPlan) {
      const icon = require('../../assets/icons/requests_gray.svg')
      return icon
    }

    switch (this.props.plan) {
      case 'Developer': return require('../../assets/icons/requests_orange.svg')
      case 'Startup': return require('../../assets/icons/requests_green.svg')
      case 'Growth': return require('../../assets/icons/requests_green.svg')
      case 'Pro': return require('../../assets/icons/requests_green.svg')
      default: return ''
    }
  }

}
