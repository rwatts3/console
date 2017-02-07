import * as React from 'react'
import {$v, Icon} from 'graphcool-styles'

interface Props {
  metric: string // should be 'Nodes' or 'Operations'
  currentUsage: number
}

export default class UsageIndicator extends React.Component<Props, {}> {

  render() {

    const greenPercentage = 38
    const lightGreenPercentage = 20
    const lightGrayPercentage = 42

    const maxNodes = 100000
    const maxOperations = 1000000

    const icon = this.iconForMetric()

    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @p: .hS16, .mv25;
          }
        `}</style>
        <div className='w100 h100 mb10 br2' style={{
          backgroundColor: `${$v.green}`,
        }}></div>
        <div className='flex itemsCenter'>
          <Icon
            src={icon}
            width={20}
            height={20}
          />
          <div className='ml6 green f14 fw6'>{this.props.currentUsage}</div>
          <div className='ml6 black50 f14'> / {this.props.metric === 'Nodes' ? maxNodes : maxOperations}</div>
        </div>
      </div>
    )
  }

  private iconForMetric = () => {
    switch (this.props.metric) {
      case 'Nodes': return require('../../../assets/icons/nodes.svg')
      case 'Operations': return require('../../../assets/icons/operations.svg')
      default: return 'Unknown'
    }
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
