import * as React from 'react'
import * as Relay from 'react-relay'
import { Field } from '../../../types/types'
import UpdateFieldIsUniqueMutation from "../../../mutations/UpdateFieldIsUniqueMutation"
const classes: any = require('./Constraints.scss')

interface Props {
  field: Field
}

export default class Constraints extends React.Component<Props, {}> {

  _updateIsUnique (isUnique: boolean) {
    Relay.Store.commitUpdate(
      new UpdateFieldIsUniqueMutation({
        fieldId: this.props.field.id,
        isUnique,
      })
    )
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.header}>Constraints</div>
        <div className={classes.row}>
          <label>
            <input
              disabled={this.props.field.isSystem}
              type='checkbox'
              checked={this.props.field.isUnique}
              onChange={(e) => this._updateIsUnique((e.target as HTMLInputElement).checked)}
            />
            This field is unique
          </label>
        </div>
      </div>
    )
  }
}
