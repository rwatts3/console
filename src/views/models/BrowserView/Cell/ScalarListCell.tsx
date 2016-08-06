import * as React from 'react'
import {CellProps} from '../../../../types/cells'
import {valueToString, stringToValue} from '../../../../utils/valueparser'

interface State {
  valueString: string,
  valid: boolean,
}

export default class ScalarListCell extends React.Component<CellProps<string[]>, State> {

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
      JSON.parse(val)
      this.setState({
        valueString: val,
        valid: true,
      })
    } catch(error) {
      this.setState({
        valueString: val,
        valid: false
    })
    }
  }

  render() {
    let style={
      backgroundColor: this.state.valid? '' :'#F7B5D1'
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
