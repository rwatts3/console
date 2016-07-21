import * as React from 'react'
const Tooltip: any = require('rc-tooltip')
import Icon from '../Icon/Icon'

require('rc-tooltip/assets/bootstrap.css')

interface Props {
  text: string
  placement?: 'left' | 'right'
}

export default class Help extends React.Component<Props, {}> {

  render() {

    const overlay = this.props.text.split('\n').map((line, index, arr) => (
      <span key={line}>{line}{index < arr.length - 1 && (<br />)}</span>
    ))

    return (
      <Tooltip
        placement={this.props.placement || 'right'}
        overlay={<span>{overlay}</span>}
        trigger={['click']}
      >
        <Icon
          width={20}
          height={20}
          src={require('assets/icons/info.svg')}
        />
      </Tooltip>
    )
  }
}
