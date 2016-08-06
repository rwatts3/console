import * as React from 'react'
import { CellProps } from './cells'
import { stringToValue } from '../../../../utils/valueparser'

export default class StringCell extends React.Component<CellProps<string>, {}> {
  render() {
    return (
      <textarea
        autoFocus
        type='text'
        ref='input'
        defaultValue={this.props.value}
        onKeyDown={(e) => this.props.onKeyDown(e)}
        onBlur={(e) => this.props.save(stringToValue(e.target.value, this.props.field))}
      />
    )
  }
}
