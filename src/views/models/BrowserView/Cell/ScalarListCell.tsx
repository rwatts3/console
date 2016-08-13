import * as React from 'react'
import { CellProps, CellState } from './cells'
import { valueToString, stringToValue } from '../../../../utils/valueparser'

export default class ScalarListCell extends React.Component<CellProps<string[]>, CellState> {

  constructor(props) {
    super(props)

    this.state = {
      valueString: valueToString(this.props.value, this.props.field, false),
      valid: true,
    }
  }

  handleChange = (e) => {
    const val = e.target.value

    if (val === '' && !this.props.field.isRequired) {
      this.setState({
        valueString: val,
        valid: true,
      })
      return
    }

    try {
      if (!(JSON.parse(val) instanceof Array)) {// if the string variable is not a JSON array
        throw 'format error'
      }

      this.setState({
        valueString: val,
        valid: true,
      })
    } catch (error) {
      this.setState({
        valueString: val,
        valid: false,
      })
    }
  }

  render() {
    const style = {
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
        onChange={this.handleChange}
      />
    )
  }
}
