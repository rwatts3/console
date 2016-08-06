import * as React from 'react'
import {CellProps} from '../../../../types/cells'

export default class StringCell extends React.Component<CellProps<string>,{}> {
  render() {
    return (
      <textarea
        autoFocus
        type='text'
        ref='input'
        defaultValue={this.props.value}
        onKeyDown={(e) => this.props.onKeyDown(e)}
        onBlur={(e) => this.props.save(e.target.value)}
      />
    )
  }
}
