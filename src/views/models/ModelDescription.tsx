import * as React from 'react'
import * as Relay from 'react-relay'
import Loading from '../../components/Loading/Loading'
import { onFailureShowNotification } from '../../utils/relay'
import UpdateModelDescriptionMutation from '../../mutations/UpdateModelDescriptionMutation'
import { Model } from '../../types/types'
import { ShowNotificationCallback } from '../../types/utils'
const classes: any = require('./ModelDescription.scss')

interface Props {
  model: Model
}

interface State {
  editDescription: boolean
  editDescriptionPending: boolean
}

class ModelDescription extends React.Component<Props, State> {

  static contextTypes = {
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    showNotification: ShowNotificationCallback
  }

  state = {
    editDescription: false,
    editDescriptionPending: false,
  }

  _saveDescription = (e: any) => {
    const description = e.target.value
    if (this.props.model.description === description) {
      this.setState({ editDescription: false } as State)
      return
    }

    this.setState({ editDescriptionPending: true } as State)

    Relay.Store.commitUpdate(
      new UpdateModelDescriptionMutation({
        modelId: this.props.model.id,
        description,
      }),
      {
        onSuccess: () => {
          analytics.track('models: edited description')

          this.setState({
            editDescription: false,
            editDescriptionPending: false,
          })
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.context.showNotification)
          this.setState({
            editDescription: false,
            editDescriptionPending: false,
          })
        },
      }
    )
  }

  render () {
    if (this.state.editDescriptionPending) {
      return (
        <Loading color='#B9B9C8' />
      )
    }

    if (this.state.editDescription) {
      return (
        <input
          autoFocus
          type='text'
          placeholder='Description'
          defaultValue={this.props.model.description}
          onBlur={this._saveDescription}
          onKeyDown={(e: any) => e.keyCode === 13 ? e.target.blur() : null}
        />
      )
    }

    return (
      <span
        className={classes.descriptionText}
        onClick={() => this.setState({ editDescription: true } as State)}
      >
        {this.props.model.description || 'Add description'}
      </span>
    )
  }
}

export default Relay.createContainer(ModelDescription, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        id
        description
      }
    `,
  },
})
