import * as React from 'react'
import * as Relay from 'react-relay'
import Cell from './Cell'
import {Model, Field} from '../../../types/types'
import {emptyDefault, compareFields} from '../utils'
import {stringToValue} from '../../../utils/valueparser'
import {isNonScalarList} from '../../../utils/graphql'
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
    const inputIndex = this.getFirstInputFieldIndex(fields)
    if (!inputIndex) {
      this.add()
    }
    console.log('render')
    return (
      <div className={classes.root} onKeyDown={this.handleKeyDown}>
        <div className={classes.empty}/>
        {fields.map((field, index) => {
          return (
            <div key={field.id} style={{width: this.props.columnWidths[field.name]}}>
              <Cell
                needsFocus={index === inputIndex}
                addnew={true}
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

  private handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.add()
    } else if (e.keyCode === 27) {
      this.props.cancel()
    }
  }

  private getFirstInputFieldIndex = (fields: Field[]) => {
    let inputIndex;
    const hasInputField = fields.some((field, index) => {
      if (isNonScalarList(field) || field.name === 'id') {
        return false
      } else {
        inputIndex = index
        return true
      }
    })
    if (hasInputField) {
      return inputIndex
    } else {
      return null
    }
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
