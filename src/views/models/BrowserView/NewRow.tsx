import * as React from 'react'
import * as Relay from 'react-relay'
import Cell from './Cell'
import {Model} from '../../../types/types'
import {emptyDefault, compareFields} from '../utils'
import {stringToValue} from '../../../utils/valueparser'
const classes: any = require('./NewRow.scss')

interface Props {
  model: Model
  projectId: string
  columnWidths: {[key: string]: number}
  add: (fieldValues: { [key: string]: any }) => void
  cancel: () => void
  reload: () => void
}

interface State {
  fieldValues: { [key: string]: any }
}

class NewRow extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    const fieldValues = props.model.fields.edges
      .map((edge) => edge.node)
      .filter((f) => f.name !== 'id')
      .mapToObject(
        (field) => field.name,
        (field) => ({
          value: stringToValue(field.defaultValue, field) || emptyDefault(field),
          field: field,
        })
      )

    this.state = {
      fieldValues,
    }
  }

  render() {
    const fields = this.props.model.fields.edges
      .map((edge) => edge.node)
      .sort(compareFields)
    return (
      <div className={classes.root}>
        <div className={classes.empty}/>
        {fields.map((field) => {
          return (
            <div style={{width: this.props.columnWidths[field.name]}}>
              <Cell
                addnew={true}
                key={field.id}
                field={field}
                width={this.props.columnWidths[field.name]}
                update={this.update}
                value={this.state.fieldValues[field.name] ? this.state.fieldValues[field.name].value : ''}
                cancel={this.props.cancel}
                projectId={this.props.projectId}
                reload={this.props.reload}
              />
            </div>
          )
        })}
        <div className={classes.buttons}>
          <button onClick={this.add}>Add</button>
          <button onClick={this.props.cancel}>Cancel</button>
        </div>
      </div>
    )
  }

  private add = () => {
    const allRequiredFieldsGiven = this.state.fieldValues
      .mapToArray((fieldName, obj) => obj)
      .reduce((acc, {field, value}) => acc && (value !== null || !field.isRequired), true)
    if (allRequiredFieldsGiven) {
      this.props.add(this.state.fieldValues)
    }
  }

  private update = (value, field, callback) => {
    const {fieldValues} = this.state
    fieldValues[field.name].value = value
    this.setState({fieldValues} as State)
    callback()
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
                            ${Cell.getFragment('field')}
                        }
                    }
                }
            }
        `,
    },
})
