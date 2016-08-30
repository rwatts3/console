import * as React from 'react'
import {CellProps} from './cells'
import {stringToValue} from '../../../../utils/valueparser'

interface State {
  value: string
}

export default class EnumCell extends React.Component<CellProps<string>, State> {

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value ? this.props.value : 'standard value',
    }
  }

  render() {
    return (
      <select
        ref='enumselector'
        autoFocus
        value={this.state.value}
        onBlur={(e: any) => this.props.save(stringToValue(e.target.value, this.props.field))}
        onKeyDown={this.props.onKeyDown}
        onChange={(e: any) => this.setState({value: e.target.value})}
      >
        <option key={'standard value'} disabled>Select an Enum ▾</option>
        {this.props.field.enumValues.map((enumValue) => (<option key={enumValue}>{enumValue}</option>))}
      </select>
    )
  }
}
