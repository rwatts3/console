import * as React from 'react'
import Icon from '../../../components/Icon/Icon'
import { Field } from '../../../types/types'
const classes: any = require('./HeaderCell.scss')

function debounce (func, wait) {
  let timeout
  return (...args) => {
    const context = this
    const later = () => {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

interface Props {
  field: Field
  width: number
  sortOrder?: string
  toggleSortOrder: () => void
  filter?: string
  updateFilter: (value: string) => void
}

export default class HeaderCell extends React.Component<Props, {}> {

  _delayedUpdateFilter: any

  constructor (props) {
    super(props)

    this._delayedUpdateFilter = debounce(this.props.updateFilter, 150)
  }

  _onFilterChangeString (value: string) {
    this._delayedUpdateFilter(value !== '' ? `"${value}"` : null)
  }

  _onFilterChangeNumber (value: string) {
    this._delayedUpdateFilter(value !== '' ? value : null)
  }

  _onFilterChangeBoolean (value: any) {
    this.props.updateFilter(value !== '' ? value.toString() : null)
  }

  _renderFilter () {
    switch (this.props.field.typeIdentifier) {
      case 'Int': return (
        <input
          type='number'
          placeholder={`Filter by ${this.props.field.name}`}
          defaultValue={this.props.filter}
          onChange={(e) => this._onFilterChangeNumber((e.target as HTMLInputElement).value)}
        />
      )
      case 'Float': return (
        <input
          type='number'
          step='any'
          placeholder={`Filter by ${this.props.field.name}`}
          defaultValue={this.props.filter}
          onChange={(e) => this._onFilterChangeNumber((e.target as HTMLInputElement).value)}
        />
      )
      case 'Boolean': return (
        <select
          onChange={(e) => this._onFilterChangeBoolean((e.target as HTMLInputElement).value)}
        >
          <option value={''}>{`Filter by ${this.props.field.name}`}</option>
          <option value={!!true}>true</option>
          <option value={false}>false</option>
        </select>
      )
      case 'Enum': return (
        <select
          onChange={(e) => this._onFilterChangeString((e.target as HTMLInputElement).value)}
          >
          <option value={''}>{`Filter by ${this.props.field.name}`}</option>
          {this.props.field.enumValues.map((enumValue) => (
            <option key={enumValue}>{enumValue}</option>
          ))}
        </select>
      )
      default: return (
        <input
          type='string'
          placeholder={`Filter by ${this.props.field.name}`}
          defaultValue={this.props.filter}
          onChange={(e) => this._onFilterChangeString((e.target as HTMLInputElement).value)}
        />
      )
    }
  }

  render () {
    const { field, width, sortOrder } = this.props

    let type = field.typeIdentifier
    if (field.isList) {
      type = `[${type}]`
    }
    if (field.isRequired) {
      type = `${type}!`
    }

    return (
      <div
        style={{ flex: `1 0 ${width}px` }}
        className={classes.root}
      >
        <div className={classes.line} onClick={this.props.toggleSortOrder}>
          <div className={classes.fieldName}>
            {field.name}
            <span className={classes.type}>{type}</span>
          </div>
          {sortOrder &&
            <Icon
              src={require('assets/icons/arrow.svg')}
              width={11}
              height={6}
              rotate={sortOrder === 'DESC' ? 180 : 0}
            />
          }
        </div>
        <div className={classes.line}>
          {this._renderFilter()}
        </div>
      </div>
    )
  }
}
