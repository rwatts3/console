import * as React from 'react'
import {CellProps, CellState} from './cells'
import {stringToValue, valueToString} from '../../../../utils/valueparser'

export default class IntCell extends React.Component<CellProps<number>, CellState> {

  constructor(props) {
    super(props)

    this.state = {
      valueString: valueToString(this.props.value, this.props.field, true),
    }
  }

  render() {
    return (
      <input
        autoFocus
        type='text'
        ref='input'
        value={this.state.valueString}
        onBlur={(e) => this.props.save(stringToValue(e.target.value, this.props.field))}
        onKeyDown={this.props.onKeyDown}
        onChange={this.handleChange}
      />
    )
  }

  private handleChange = (e) => {
    if (e.target.value === '') {
      this.setState({
        valueString: e.target.value,
      })
      return
    }

    const regex = /^-?\d*$/
    if (regex.test(e.target.value)) {
      this.setState({
        valueString: e.target.value,
      })
    }
  }
}
