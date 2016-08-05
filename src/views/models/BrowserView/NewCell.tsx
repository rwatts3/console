import * as React from 'react'
import * as Relay from 'react-relay'
const classnames: any = require('classnames')
import ToggleButton from '../../../components/ToggleButton/ToggleButton'
import { ToggleSide } from '../../../components/ToggleButton/ToggleButton'
import { isScalar } from '../../../utils/graphql'
import { valueToString, stringToValue } from '../../../utils/valueparser'
import Datepicker from '../../../components/Datepicker/Datepicker'
import ModelSelector from '../../../components/ModelSelector/ModelSelector'
import { Field } from '../../../types/types'
const classes: any = require('./Cell.scss')

interface Props {
  field: Field
  projectId: string
  focus: boolean
  width: number
  update: (value: any, field: Field) => void
  onFocus: () => void
  onBlur: () => void
  submit: () => void
  cancel: () => void
  defaultValue: any
}

interface State {
  value: any
}

class NewCell extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)

    this.state = {
      value: props.defaultValue,
    }
  }

  _updateValue (inputValue: any, shouldBlur: boolean) {
    const value = stringToValue(inputValue, this.props.field)
    if (shouldBlur) {
      this.props.onBlur()
    }
    this.setState({ value } as State)
    this.props.update(value, this.props.field)
  }

  _cancelOnEscape (e: React.KeyboardEvent<any>) {
    switch (e.keyCode) {
      case 13:
        this.props.submit()
        break
      case 27:
        this.props.cancel()
        break
    }
  }

  _onEscapeTextarea (e: React.KeyboardEvent<any>) {
    if (e.keyCode === 27) {
      this.props.onBlur()
    }
  }

  _renderContent () {
    if (this.props.field.name === 'id') {
      return (
        <span className={classes.value}>Id will be generated</span>
      )
    }

    const valueString = valueToString(this.state.value, this.props.field, false)

    if (!this.props.focus) {
      return (
        <input
          type='text'
          defaultValue={valueString}
          onFocus={this.props.onFocus}
        />
      )
    }

    if (!isScalar(this.props.field.typeIdentifier)) {
      if (this.props.field.isList) {
        return (
          <div>Add item to edit this field</div>
        )
      } else {
        return (
          <ModelSelector
            relatedModel={this.props.field.relatedModel}
            projectId={this.props.projectId}
            value={this.state.value ? this.state.value.id : null}
            onSelect={(value) => this._updateValue(value, true)}
            onCancel={this.props.onBlur}
          />
        )
      }
    }

    if (this.props.field.isList) {
      return (
        <textarea
          type='text'
          defaultValue={valueString}
          onKeyDown={(e) => this._onEscapeTextarea(e)}
          onChange={(e) => this._updateValue(e.target.value, false)}
          onBlur={this.props.onBlur}
        />
      )
    }

    switch (this.props.field.typeIdentifier) {
      case 'Int':
        return (
          <input
            autoFocus
            type='number'
            defaultValue={valueString}
            onChange={(e) => this._updateValue(e.target.value, false)}
            onKeyDown={(e) => this._cancelOnEscape(e)}
            onBlur={this.props.onBlur}
          />
        )
      case 'Float':
        return (
          <input
            type='number'
            step='any'
            autoFocus
            defaultValue={valueString}
            onChange={(e) => this._updateValue(e.target.value, false)}
            onKeyDown={(e) => this._cancelOnEscape(e)}
            onBlur={this.props.onBlur}
          />
        )
      case 'Boolean':
        return (
          <ToggleButton
            leftText='false'
            rightText='true'
            side={ToggleSide.Left}
            onChange={(side) => this._updateValue(side === ToggleSide.Left ? 'false' : 'true', false)}
            onClickOutside={this.props.onBlur}
          />
        )
      case 'Enum':
        return (
          <select
            defaultValue={valueString}
            onChange={(e) => this._updateValue(e.target.value, false)}
            onKeyDown={(e) => this._cancelOnEscape(e)}
            onBlur={this.props.onBlur}
          >
            <option disabled={this.props.focus} />
            {this.props.field.enumValues.map((enumValue) => (
              <option key={enumValue}>{enumValue}</option>
            ))}
          </select>
        )
      case 'String':
        return (
          <textarea
            autoFocus
            type='text'
            ref='input'
            defaultValue={valueString}
            onKeyDown={(e) => this._onEscapeTextarea(e)}
            onChange={(e) => this._updateValue(e.target.value, false)}
            onBlur={this.props.onBlur}
          />
        )
      case 'DateTime':
        return (
          <Datepicker
            className={classes.datepicker}
            defaultValue={new Date(valueString)}
            onChange={(m) => this._updateValue(m.toISOString(), true)}
            onCancel={this.props.onBlur}
            defaultOpen={true}
            applyImmediately={false}
          />
        )
      default:
        return (
          <input
            type='text'
            defaultValue={valueString}
            onChange={(e) => this._updateValue(e.target.value, false)}
            onKeyDown={(e) => this._cancelOnEscape(e)}
            onBlur={this.props.onBlur}
          />
        )
    }
  }

  render () {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.field.name === 'id',
      [classes.editing]: this.props.focus,
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

export default Relay.createContainer(NewCell, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
        id
        name
        isList
        typeIdentifier
        enumValues
        relatedModel {
          ${ModelSelector.getFragment('relatedModel')}
        }
      }
    `,
  },
})
