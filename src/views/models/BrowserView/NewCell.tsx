import * as React from 'react'
const classnames: any = require('classnames')
import { valueToString, stringToValue } from '../utils'
import ToggleButton from '../../../components/ToggleButton/ToggleButton'
import { ToggleSide } from '../../../components/ToggleButton/ToggleButton'
import Datepicker from '../../../components/Datepicker/Datepicker'
import { Field } from '../../../types/types'
const classes: any = require('./Cell.scss')

interface Props {
  field: Field
  width: number
  update: (value: any, field: Field) => void
  submit: () => void
  cancel: () => void
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
      focus: false,
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

  _onEscapeTextarea (e: __React.KeyboardEvent) {
    if (e.keyCode === 27) {
      this.setState({ focus: false } as State)
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
      case 'String':
        if (this.state.focus) {
          return (
            <textarea
              autoFocus
              type='text'
              ref='input'
              defaultValue={valueString}
              onKeyDown={(e) => this._onEscapeTextarea(e)}
              onChange={(e) => this._updateValue((e.target as HTMLInputElement).value)}
              onFocus={() => this.setState({ focus: true } as State)}
              onBlur={() => this.setState({ focus: false } as State)}
            />
          )
        }

        return (
          <input
            type='text'
            defaultValue={valueString}
            onFocus={() => this.setState({ focus: true } as State)}
          />
        )
      case 'DateTime':
        return (
          <Datepicker
            defaultValue={new Date(valueString)}
            onChange={(m) => {
              this._updateValue(m.toISOString())
              this.setState({ focus: false } as State)
            }}
            onCancel={() => this.setState({ focus: false } as State)}
            onFocus={() => this.setState({ focus: true } as State)}
            defaultOpen={false}
            applyImmediately={false}
          />
        )
      default:
        return (
          <input
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
        style={{ flex: `1 0 ${this.props.width}px` }}
        className={rootClassnames}
      >
        {this._renderContent()}
      </div>
    )
  }
}
