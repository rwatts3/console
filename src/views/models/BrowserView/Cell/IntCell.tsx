import * as React from 'react'
import {CellProps} from '../../../../types/cells'
import {stringToValue, valueToString} from '../../../../utils/valueparser'

export default class IntCell extends React.Component<CellProps<number>,{valueString: string}> {

  constructor(props) {
    super(props)

    this.state = {
      valueString: valueToString(this.props.value, this.props.field, true),
    }
  }

  handleChange(e) {

    if (e.target.value === '') {
      this.setState({
        valueString: e.target.value,
      })
      return
    }

      let regex = /^-?\d*$/
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
          ref='input'
          value={this.state.valueString}
          onBlur={(e) => this.props.save(stringToValue(e.target.value, this.props.field))}
          onKeyDown={(e) => this.props.onKeyDown(e)}
          onChange={this.handleChange.bind(this)}
        />
      )
  }
}
