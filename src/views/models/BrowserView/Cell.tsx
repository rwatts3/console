import * as React from 'react'
import * as Relay from 'react-relay'
import { findDOMNode } from 'react-dom'
import Loading from '../../../components/Loading/Loading'
import { classnames } from '../../../utils/classnames'
import { isValidValue, valueToString, stringToValue } from '../../../utils/valueparser'
import { isScalar } from '../../../utils/graphql'
import { Field } from '../../../types/types'
import ModelSelector from '../../../components/ModelSelector/ModelSelector'
import ToggleButton from '../../../components/ToggleButton/ToggleButton'
import { ToggleSide } from '../../../components/ToggleButton/ToggleButton'
import Datepicker from '../../../components/Datepicker/Datepicker'
import RelationsPopup from './RelationsPopup'
const classes: any = require('./Cell.scss')

export type UpdateCallback = (success: boolean) => void

interface Props {
  field: Field
  projectId: string
  itemId: string
  value: any
  width: number
  update: (value: any, field: Field, callback: UpdateCallback) => void
  reload: () => void
}

interface State {
  editing: boolean
  loading: boolean
}

class Cell extends React.Component<Props, State> {

  refs: {
    [key: string]: any;
    input: HTMLInputElement
  }

  constructor (props: Props) {
    super(props)

    this.state = {
      editing: false,
      loading: false,
    }
  }

  componentDidUpdate (prevState: State): void {
    if (!prevState.editing && this.state.editing && this.refs.input) {
      findDOMNode<HTMLInputElement>(this.refs.input).select()
    }
  }

  _startEditing (): void {
    if (this.props.field.name !== 'id') {
      this.setState({ editing: true } as State)
    }
  }

  _cancel (): void {
    this.setState({ editing: false } as State)
  }

  _save (inputValue: string): void {
    if (!isValidValue(inputValue, this.props.field)) {
      alert(`'${inputValue}' is not a valid value for field ${this.props.field.name}`)
      this.setState({ editing: false } as State)
      return
    }

    const value = stringToValue(inputValue, this.props.field)

    if (value === this.props.value) {
      this.setState({ editing: false } as State)
      return
    }

    this.setState({ loading: true } as State)

    this.props.update(value, this.props.field, () => {
      this.setState({
        editing: false,
        loading: false,
      } as State)
    })
  }

  _onKeyDown (e: React.KeyboardEvent<HTMLSelectElement | HTMLInputElement>): void {
    switch (e.keyCode) {
      case 13:
        this._save(e.target.value)
        break
      case 27:
        this._cancel()
        break
    }
  }

  _onEscapeTextarea (e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.keyCode === 27) {
      this._save(e.target.value)
    }
  }

  _renderContent (): JSX.Element {
    if (this.state.loading) {
      return (
        <div className={classes.loading}>
          <Loading color='#B9B9C8'/>
        </div>
      )
    }

    const valueString = valueToString(this.props.value, this.props.field, true)

    if (this.state.editing) {
      if (!isScalar(this.props.field.typeIdentifier)) {
        if (this.props.field.isList) {
          return (
            <RelationsPopup
              originField={this.props.field}
              originItemId={this.props.itemId}
              onCancel={() => {
                this.setState({ editing: false } as State)
                this.props.reload()
              }}
              projectId={this.props.projectId}
            />
          )
        } else {
          return (
            <ModelSelector
              relatedModel={this.props.field.relatedModel}
              projectId={this.props.projectId}
              value={this.props.value ? this.props.value.id : null}
              onSelect={(value) => this._save(value)}
              onCancel={() => this._cancel()}
            />
          )
        }
      }

      if (this.props.field.isList) {
        if (isScalar(this.props.field.typeIdentifier)) {
          return (
            <textarea
              autoFocus
              type='text'
              ref='input'
              defaultValue={valueString}
              onKeyDown={(e) => this._onEscapeTextarea(e)}
              onBlur={(e) => this._save(e.target.value)}
            />
          )
        }

        switch (this.props.field.typeIdentifier) {
          case 'Int':
            return (
              <input
                autoFocus
                type='number'
                ref='input'
                defaultValue={valueString}
                onBlur={(e) => this._save(e.target.value)}
                onKeyDown={(e) => this._onKeyDown(e)}
              />
            )
          case 'Float':
            return (
              <input
                autoFocus
                type='number'
                step='any'
                ref='input'
                defaultValue={valueString}
                onBlur={(e) => this._save(e.target.value)}
                onKeyDown={(e) => this._onKeyDown(e)}
              />
            )
          case 'Boolean':
            return (
              <ToggleButton
                leftText='false'
                rightText='true'
                side={valueString === 'true' ? ToggleSide.Right : ToggleSide.Left}
                onClickOutside={(side) => this._save(side === ToggleSide.Left ? 'false' : 'true')}
              />
            )
          case 'Enum':
            return (
              <select
                autoFocus
                defaultValue={valueString}
                onBlur={(e) => this._save(e.target.value)}
                onKeyDown={(e) => this._onKeyDown(e)}
              >
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
                onBlur={(e) => this._save(e.target.value)}
              />
            )
          case 'DateTime':
            return (
              <Datepicker
                className={classes.datepicker}
                defaultValue={new Date(valueString)}
                onChange={(m) => this._save(m.toISOString())}
                onCancel={() => this._cancel()}
                defaultOpen={true}
                applyImmediately={false}
              />
            )
          default:
            return (
              <input
                autoFocus
                type='text'
                ref='input'
                defaultValue={valueString}
                onKeyDown={(e) => this._onKeyDown(e)}
                onBlur={(e) => this._save(e.target.value)}
              />
            )
        }
      }
    }

    return (
      <span className={classes.value}>{valueString}</span>
    )
  }

  render (): JSX.Element {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.value === null,
      [classes.editing]: this.state.editing,
    })

    return (
      <div
        style={{ flex: `1 0 ${this.props.width}px` }}
        className={rootClassnames}
        onDoubleClick={() => this._startEditing()}
      >
        {this._renderContent()}
      </div>
    )
  }
}

export default Relay.createContainer(Cell, {
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
        ${RelationsPopup.getFragment('originField')}
      }
    `,
  },
})
