import * as React from 'react'
const classnames: any = require('classnames')
import { valueToString, stringToValue } from '../utils'
import ToggleButton from '../../../components/ToggleButton/ToggleButton'
import { ToggleSide } from '../../../components/ToggleButton/ToggleButton'
import { Field } from '../../../types/types'
const classes: any = require('./Cell.scss')

interface Props {
  field: Field
  width: number
  update: (value: any, field: Field) => void
  submit: () => void
  cancel: () => void
  autoFocus: boolean
  defaultValue: any | null
}

interface State {
  value: any
  focus: boolean
}

export default class NewCell extends React.Component<Props, State> {

  constructor (props) {
    super(props)

    this.state = {
      value: props.defaultValue,
      focus: props.autoFocus,
    }
  }

  _updateValue (inputValue) {
    const value = stringToValue(inputValue, this.props.field)
    this.setState({ value } as State)
    this.props.update(value, this.props.field)
  }

  _cancelOnEscape (e: __React.KeyboardEvent) {
    switch (e.keyCode) {
      case 13:
        this.props.submit()
        break
      case 27:
        this.props.cancel()
        break
    }
  }

  _renderContent () {
    if (this.props.field.name === 'id') {
      return (
        <span className={classes.value}>Id will be generated</span>
      )
    }

    const valueString = valueToString(this.state.value, this.props.field, false)

    if (this.props.field.isList) {
      return (
        <input
          autoFocus={this.props.autoFocus}
          type='text'
          defaultValue={valueString}
          onChange={(e) => this._updateValue((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => this._cancelOnEscape(e)}
          onFocus={() => this.setState({ focus: true } as State)}
          onBlur={() => this.setState({ focus: false } as State)}
        />
      )
    }

    switch (this.props.field.typeIdentifier) {
      case 'Int':
        return (
          <input
            autoFocus={this.props.autoFocus}
            type='number'
            defaultValue={valueString}
            onChange={(e) => this._updateValue((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => this._cancelOnEscape(e)}
            onFocus={() => this.setState({ focus: true } as State)}
            onBlur={() => this.setState({ focus: false } as State)}
          />
        )
      case 'Float':
        return (
          <input
            autoFocus={this.props.autoFocus}
            type='number'
            step='any'
            defaultValue={valueString}
            onChange={(e) => this._updateValue((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => this._cancelOnEscape(e)}
            onFocus={() => this.setState({ focus: true } as State)}
            onBlur={() => this.setState({ focus: false } as State)}
          />
        )
      case 'Boolean':
        return (
          <ToggleButton
            leftText='false'
            rightText='true'
            side={ToggleSide.Left}
            onClickOutside={(side) => this._updateValue(side === ToggleSide.Left ? 'false' : 'true')}
          />
        )
      case 'Enum':
        return (
          <select
            autoFocus={this.props.autoFocus}
            defaultValue={valueString}
            onChange={(e) => this._updateValue((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => this._cancelOnEscape(e)}
            onFocus={() => this.setState({ focus: true } as State)}
            onBlur={() => this.setState({ focus: false } as State)}
          >
            <option disabled={this.state.focus} />
            {this.props.field.enumValues.map((enumValue) => (
              <option key={enumValue}>{enumValue}</option>
            ))}
          </select>
        )
      default:
        return (
          <input
            autoFocus={this.props.autoFocus}
            type='text'
            defaultValue={valueString}
            onChange={(e) => this._updateValue((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => this._cancelOnEscape(e)}
            onFocus={() => this.setState({ focus: true } as State)}
            onBlur={() => this.setState({ focus: false } as State)}
          />
        )
    }
  }

  render () {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.field.name === 'id',
      [classes.editing]: this.state.focus,
      [classes.invalid]: (
        (this.props.field.isRequired && this.state.value === null) &&
        this.props.field.name !== 'id'
      ),
    })

    return (
      <div
        style={{ width: this.props.width }}
        className={rootClassnames}
      >
        {this._renderContent()}
      </div>
    )
  }
}
