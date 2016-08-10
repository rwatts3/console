import * as React from 'react'
import * as Relay from 'react-relay'
import Icon from '../../../components/Icon/Icon'
import {Link} from 'react-router'
import {isScalar} from '../../../utils/graphql'
import {Field} from '../../../types/types'
const classes: any = require('./HeaderCell.scss')

function debounce(func, wait) {
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
  filterVisible: boolean
  params: any
}

class HeaderCell extends React.Component<Props, {}> {

  _delayedUpdateFilter: any

  constructor(props) {
    super(props)

    this._delayedUpdateFilter = debounce(this.props.updateFilter, 150)
  }

  _onFilterChangeString(value: string) {
    this._delayedUpdateFilter(value !== '' ? `"${value}"` : null)
  }

  _onFilterChangeEnum(value: string) {
    this._delayedUpdateFilter(value !== '' ? `${value}` : null)
  }

  _onFilterChangeNumber(value: string) {
    this._delayedUpdateFilter(value !== '' ? value : null)
  }

  _onFilterChangeBoolean(value: any) {
    this.props.updateFilter(value !== '' ? value.toString() : null)
  }

  _renderFilter() {
    switch (this.props.field.typeIdentifier) {
      case 'Int':
        return (
          <input
            type='number'
            placeholder={`Filter by ${this.props.field.name}`}
            defaultValue={this.props.filter}
            onChange={(e) => this._onFilterChangeNumber(e.target.value)}
          />
        )
      case 'Float':
        return (
          <input
            type='number'
            step='any'
            placeholder={`Filter by ${this.props.field.name}`}
            defaultValue={this.props.filter}
            onChange={(e) => this._onFilterChangeNumber(e.target.value)}
          />
        )
      case 'Boolean':
        return (
          <select
            onChange={(e) => this._onFilterChangeBoolean(e.target.value)}>
            <option value={''}>{`Filter by ${this.props.field.name}`}</option>
            <option value={'true'}>true</option>
            <option value={'false'}>false</option>
          </select>
        )
      case 'Enum':
        return (
          <select
            onChange={(e) => this._onFilterChangeEnum(e.target.value)}
          >
            <option value={''}>{`Filter by ${this.props.field.name}`}</option>
            {this.props.field.enumValues.map((enumValue) => (
              <option key={enumValue}>{enumValue}</option>
            ))}
          </select>
        )
      default:
        return (
          <input
            type='text'
            placeholder={`Filter by ${this.props.field.name}`}
            defaultValue={this.props.filter}
            onChange={(e) => this._onFilterChangeString(e.target.value)}
          />
        )
    }
  }

  _toggleSortOrder = () => {
    if (isScalar(this.props.field.typeIdentifier)) {
      this.props.toggleSortOrder()
    }
  }

  render() {
    const {field, width, sortOrder} = this.props

    let type = field.typeIdentifier
    if (field.isList) {
      type = `[${type}]`
    }
    if (field.isRequired) {
      type = `${type}!`
    }

    const editUrl = `/${this.props.params.projectName}/models/${this.props.params.modelName}/structure/edit/${this.props.field.name}` // tslint:disable-line

    return (
      <div
        style={{ flex: `1 0 ${width}px` }}
        className={classes.root}
      >
        <div className={classes.row}>
          <div className={classes.fieldName}>
            {field.name}
            <span className={classes.type}>{type}</span>
            <Link to={editUrl} className={classes.edit}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/edit.svg')}
              />
            </Link>
          </div>
          {isScalar(this.props.field.typeIdentifier) &&
          <div
            onClick={this._toggleSortOrder}
            className={`${classes.sort} ${sortOrder ? classes.active : ''}`}
          >
            <Icon
              src={require('assets/icons/arrow.svg')}
              width={11}
              height={6}
              rotate={sortOrder === 'DESC' ? 180 : 0}
            />
          </div>
          }
        </div>
        {this.props.filterVisible &&
        <div className={classes.row}>
          {this._renderFilter()}
        </div>
        }
      </div>
    )
  }
}

export default Relay.createContainer(HeaderCell, {
    fragments: {
        field: () => Relay.QL`
            fragment on Field {
                id
                name
                isList
                typeIdentifier
                isRequired
                enumValues
            }
        `,
    },
})
