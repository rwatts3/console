import * as React from 'react'
import {Icon} from 'graphcool-styles'
import Tooltip from 'rc-tooltip'

interface Props {
  className?: string
  width: number
  height: number
  tops: number[] // distances for the indicators from the top (in %)
  plain: boolean[] // false if indicator should have the exclamation point
  messages?: JSX.Element[] // will be displayed in a tooltip on hovering the indicator
}

export default class BreakingChangeIndicator extends React.Component<Props, {}> {

  render() {
    const breaking = require('../../assets/icons/breaking.svg')
    const breakingPlain = require('../../assets/icons/breaking_plain.svg')
    return (
      <div
        className={`relative ${this.props.className}`}
      >
        <style jsx={true}>{`
            .breakingChangeIndicator {
              @inherit: .absolute;
              left: 99%;
            }
          `}</style>
        {this.props.tops.map((top, i) =>
          (<div
            key={i}
            className='breakingChangeIndicator'
            style={{top: top + '%'}}
          >
            {this.props.messages && this.props.messages.length === this.props.tops.length ?
              (<Tooltip
                overlay={this.props.messages[i]}
              >
                <Icon
                  className='pointer'
                  src={this.props.plain[i] ? breakingPlain : breaking}
                  width={this.props.width}
                  height={this.props.height}
                />
              </Tooltip>)
              :
              (
                <Icon
                  src={this.props.plain[i] ? breakingPlain : breaking}
                  width={this.props.width}
                  height={this.props.height}
                />
              )
            }
          </div>),
        )}
        {this.props.children}
      </div>
    )
  }
}

/*

 <Tooltip
 placement={'bottom'}
 overlay={<span onClick={(e: any) => e.stopPropagation()}>
 Please enter a valid url.
 </span>}
 >
 <Icon
 width={24}
 height={24}
 src={require('assets/new_icons/warning.svg')}
 color={'#F5A623'}
 />
 </Tooltip>

 */
