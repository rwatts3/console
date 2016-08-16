import * as React from 'react'
import { CellProps } from './cells'
import { stringToValue } from '../../../../utils/valueparser'

export default class EnumCell extends React.Component<CellProps<string>, {}> {

  refs: {
    [key: string]: any
    enumselector: HTMLSelectElement
  }

  componentDidMount() {
    this.refs.enumselector
  }

  render() {
    return (
      <select
        ref='enumselector'
        autoFocus
        defaultValue={this.props.value}
        onBlur={(e) => this.props.save(stringToValue(e.target.value, this.props.field))}
        onKeyDown={this.props.onKeyDown}
      >
        {this.props.field.enumValues.map((enumValue) => (
          <option key={enumValue}>{enumValue}</option>
        ))}
      </select>
    )
  }
}
