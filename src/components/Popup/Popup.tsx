import * as React from 'react'
import ClickOutside from 'react-click-outside'
const classes: any = require('./Popup.scss')

interface Props {
  // TODO make non-optional when resolved: https://github.com/Microsoft/TypeScript/issues/8588
  children?: Element
  onClickOutside: () => void
  height: string
}

export default class Popup extends React.Component<Props, {}> {

  render () {
    return (
      <div className={classes.background}>
        <ClickOutside
          onClickOutside={this.props.onClickOutside}
          style={{ height: this.props.height }}
        >
          {this.props.children}
        </ClickOutside>
      </div>
    )
  }
}
