import * as React from 'react'
import * as Relay from 'react-relay'
import NewCell from './NewCell'
import { Model } from '../../../types/types'
import { emptyDefault, compareFields } from '../utils'
import { isScalar } from '../../../utils/graphql'
import { stringToValue } from '../../../utils/valueparser'
const classes: any = require('./NewRow.scss')

interface Props {
  model: Model
  projectId: string
  columnWidths: {[key: string]: number}
  add: (fieldValues: { [key: string]: any }) => void
  cancel: () => void
}

interface State {
  fieldValues: { [key: string]: any }
  focussedField: string | null
}

class NewRow extends React.Component<Props, State> {

  constructor (props) {
    super(props)

    const fieldValues = props.model.fields.edges
      .map((edge) => edge.node)
      .filter((f) => f.name !== 'id')
      .mapToObject(
        (field) => field.name,
        (field) => ({
          field,
          value: stringToValue(field.defaultValue, field) || emptyDefault(field),
        })
      )

    this.state = {
      fieldValues,
      focussedField: null,
    }
  }

  _add = () => {
    const allRequiredFieldsGiven = this.state.fieldValues
      .mapToArray((fieldName, obj) => obj)
      .reduce((acc, { field, value }) => acc && (value !== null || !field.isRequired), true)

    if (allRequiredFieldsGiven) {
      this.props.add(this.state.fieldValues)
    }
  }

  _update = (value, field) => {
    const { fieldValues } = this.state
    fieldValues[field.name].value = value
    this.setState({ fieldValues } as State)
  }

  render () {
    const fields = this.props.model.fields.edges
      .map((edge) => edge.node)
      .filter((field) => isScalar(field.typeIdentifier) || !field.isList)
      .sort(compareFields)

    return (
      <div className={classes.root}>
        <div className={classes.empty} />
        {fields.map((field) => (
          <NewCell
            key={field.id}
            field={field}
            width={this.props.columnWidths[field.name]}
            update={this._update}
            submit={this._add}
            defaultValue={this.state.fieldValues[field.name] ? this.state.fieldValues[field.name].value : ''}
            cancel={this.props.cancel}
            projectId={this.props.projectId}
            focus={this.state.focussedField === field.name}
            onFocus={() => this.setState({ focussedField: field.name } as State)}
            onBlur={() => this.setState({ focussedField: null } as State)}
          />
        ))}
        <div className={classes.buttons}>
          <span onClick={this._add}>Add</span>
          <span onClick={this.props.cancel}>Cancel</span>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(NewRow, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        fields(first: 1000) {
          edges {
            node {
              id
              name
              defaultValue
              enumValues
              typeIdentifier
              isList
              ${NewCell.getFragment('field')}
            }
          }
        }
      }
    `,
  },
})
