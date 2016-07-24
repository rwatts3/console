import * as React from 'react'
import * as Relay from 'react-relay'
import { Field } from '../../../types/types'
import { isScalar } from '../../../utils/graphql'
import { onFailureShowNotification } from '../../../utils/relay'
import { ShowNotificationCallback } from '../../../types/utils'
import UpdateFieldIsUniqueMutation from '../../../mutations/UpdateFieldIsUniqueMutation'
const classes: any = require('./Constraints.scss')

interface Props {
  field: Field
}

export default class Constraints extends React.Component<Props, {}> {

  static contextTypes: React.ValidationMap<any> = {
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    showNotification: ShowNotificationCallback
  }

  _updateIsUnique (isUnique: boolean) {
    Relay.Store.commitUpdate(
      new UpdateFieldIsUniqueMutation({
        fieldId: this.props.field.id,
        isUnique,
      }),
      {
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.context.showNotification)
        },
      }
    )
  }

  render () {
    const disabled = this.props.field.isSystem || !isScalar(this.props.field.typeIdentifier)
    return (
      <div className={classes.root}>
        <div className={classes.header}>Constraints</div>
        <div className={classes.row}>
          <label className={disabled ? classes.disabled : ''}>
            <input
              disabled={disabled}
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
