import * as React from 'react'
import {CellProps} from './cells'
import {stringToValue} from '../../../../utils/valueparser'

export default class StringCell extends React.Component<CellProps<string>, {}> {

  render() {
    const numLines = this.props.value ? this.props.value.split(/\r\n|\r|\n/).length : 1

    return (
      <textarea
        autoFocus
        type='text'
        ref='input'
        defaultValue={this.props.value}
        onKeyDown={this.onKeyDown}
        style={{
          height: Math.min(Math.max(56, numLines * 20), 300),
        }}
        onBlur={(e: any) => this.props.save(stringToValue(e.target.value, this.props.field))}
      />
    )
  }

  private onKeyDown = (e: any) => {
    // filter arrow keys
    if ([37,38,39,40].includes(e.keyCode)) {
      return
    }
    this.props.onKeyDown(e)
  }
}
