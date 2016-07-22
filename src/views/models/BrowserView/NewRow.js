import React, { PropTypes } from 'react'
import NewCell from './NewCell'
import { emptyDefault } from '../utils'
import classes from './NewRow.scss'

export default class NewRow extends React.Component {

  static propTypes = {
    fields: PropTypes.array.isRequired,
    columnWidths: PropTypes.object.isRequired,
    add: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    const fieldValues = props.fields
      .filter((f) => f.name !== 'id')
      .mapToObject(
        (field) => field.name,
        (field) => ({
          field,
          value: emptyDefault(field.typeIdentifier, field.isList),
        })
      )

    this.state = {
      fieldValues,
    }
  }

  _add () {
    const allRequiredFieldsGiven = this.state.fieldValues
      .mapToArray((fieldName, obj) => obj)
      .reduce((acc, { field, value }) => acc && (value !== null || !field.isRequired), true)

    if (allRequiredFieldsGiven) {
      this.props.add(this.state.fieldValues)
    }
  }

  _update (value, field) {
    const { fieldValues } = this.state
    fieldValues[field.name].value = value
    this.setState({ fieldValues })
  }

  render () {
    const firstAutoFocusField = this.props.fields.find(({ typeIdentifier }) => (
      ['String', 'Float', 'Integer', 'Enum'].includes(typeIdentifier)
    ))

    return (
      <div className={classes.root}>
        <div className={classes.empty} />
        {this.props.fields.map((field) => (
          <NewCell
            key={field.id}
            field={field}
            width={this.props.columnWidths[field.name]}
            update={::this._update}
            submit={::this._add}
            autoFocus={firstAutoFocusField === field}
            defaultValue={emptyDefault(field.typeIdentifier, field.isList)}
            cancel={this.props.cancel}
          />
        ))}
      </div>
    )
  }
}
