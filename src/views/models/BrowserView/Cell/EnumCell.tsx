import * as React from 'react'
import {CellProps} from '../../../../types/cells'

export default class EnumCell extends React.Component<CellProps<string>,{}> {
  render() {
    return (
      <select
        autoFocus
        defaultValue={this.props.value}
        onBlur={(e) => this.props.save(e.target.value)}
        onKeyDown={(e) => this.props.onKeyDown(e)}
      >
        {this.props.field.enumValues.map((enumValue) => (
          <option key={enumValue}>{enumValue}</option>
        ))}
      </select>
    )
  }
}
