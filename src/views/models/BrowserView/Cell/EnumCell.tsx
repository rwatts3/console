import * as React from 'react'
import { CellProps } from './cells'
import { stringToValue } from '../../../../utils/valueparser'

export default class EnumCell extends React.Component<CellProps<string>, {}> {
  render() {
    return (
      <select
        autoFocus
        defaultValue={this.props.value}
        onBlur={(e) => this.props.save(stringToValue(e.target.value, this.props.field))}
        onKeyDown={(e) => this.props.onKeyDown(e)}
      >
        {this.props.field.enumValues.map((enumValue) => (
          <option key={enumValue}>{enumValue}</option>
        ))}
      </select>
    )
  }
}
