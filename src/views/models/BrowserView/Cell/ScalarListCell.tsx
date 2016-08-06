import * as React from 'react'
import { CellProps, CellState } from './cells'
import { valueToString, stringToValue } from '../../../../utils/valueparser'

export default class ScalarListCell extends React.Component<CellProps<string[]>, CellState> {

  constructor(props) {
    super(props)

    this.state = {
      valueString: valueToString(this.props.value, this.props.field, true),
      valid: true,
    }
  }

  handleChange(e) {
    let val = e.target.value
    try {
      let res = JSON.parse(val)
      if (res instanceof Array) {

        this.setState({
          valueString: val,
          valid: true,
        })
        return
      }
      throw 'format error'
    } catch (error) {
      this.setState({
        valueString: val,
        valid: false,
      })
    }
  }

  render() {
    let style = {
      backgroundColor: this.state.valid ? '' : '#F7B5D1',
    }
    return (
      <textarea
        style={style}
        autoFocus
        type='text'
        ref='input'
        value={this.state.valueString}
        onKeyDown={this.props.onKeyDown}
        onBlur={(e) => this.props.save(stringToValue(e.target.value, this.props.field))}
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}
