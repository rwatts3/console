import * as React from 'react'
import { CellProps, CellState } from './cells'
import { stringToValue, valueToString } from '../../../../utils/valueparser'

export default class FloatCell extends React.Component<CellProps<number>, CellState> {
  constructor(props) {
    super(props)

    this.state = {
      valueString: valueToString(this.props.value, this.props.field, true),
    }
  }

  handleChange = (e) => {

    if (e.target.value === '') {
      this.setState({
        valueString: e.target.value,
      })
      return
    }

    const regex = /^-?\d*(\.\d*)?$/
    if (regex.test(e.target.value)) {
      this.setState({
        valueString: e.target.value,
      })
    }
  }

  render() {
    return (
      <input
        autoFocus
        type='text'
        step='any'
        ref='input'
        value={this.state.valueString}
        onBlur={(e) => this.props.save(stringToValue(e.target.value, this.props.field))}
        onKeyDown={this.props.onKeyDown}
        onChange={this.handleChange}
      />)
  }
}
