import * as React from 'react'
import * as Relay from 'react-relay'
import {SystemToken} from '../../types/types'
import Icon from '../../components/Icon/Icon'
import DeleteSystemTokenMutation from '../../mutations/DeleteSystemTokenMutation'
import {ShowNotificationCallback} from '../../types/utils'
import {onFailureShowNotification} from '../../utils/relay'
import AddSystemTokenMutation from '../../mutations/AddSystemTokenMutation'

const classes = require('./SystemTokenRow.scss')

interface Props {
  systemToken?: SystemToken
  projectId: string
  addNew?: boolean
}

interface State {
  newTokenName: string
}

class SystemTokenRow extends React.Component<Props, State> {

  static contextTypes = {
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    showNotification: ShowNotificationCallback
  }

  constructor(props) {
    super(props)

    this.state = {
      newTokenName: '',
    }
  }

  render() {

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.name}>
            {this.props.addNew ? (
              <input
                value={this.state.newTokenName}
                onChange={(e) => this.setState({newTokenName: e.target.value})}
                placeholder={'Add new token ...'}
              />
            ) : this.props.systemToken.name}
          </div>
          {!this.props.addNew &&
          <div className={classes.token}>
            {this.getTokenSuffix()}
          </div>
          }
        </div>
        {!this.props.addNew &&
        <Icon
          width={19}
          height={19}
          src={require('assets/icons/delete.svg')}
          onClick={this.deleteSystemToken}
        />
        }
        {this.props.addNew && this.state.newTokenName !== '' &&
        <Icon
          width={19}
          height={19}
          src={require('assets/new_icons/add_new.svg')}
          onClick={this.addSystemToken}
        />
        }
      </div>
    )
  }

  private getTokenSuffix = (): string => {
    // Getting the suffix because that's the only part that's changing
    const systemTokenSuffix = this.props.systemToken.token.split('.').reverse()[0]
    // We can change the style here in the future to make the text look 'cooler'
    return systemTokenSuffix
  }

  private addSystemToken = (): void => {
    Relay.Store.commitUpdate(
      new AddSystemTokenMutation({
        projectId: this.props.projectId,
        tokenName: this.state.newTokenName,
      }),
      {
        onSuccess: () => this.setState({newTokenName: ''}),
        onFailure: (transaction) => onFailureShowNotification(transaction, this.context.showNotification),
      })
  }

  private deleteSystemToken = (): void => {
    Relay.Store.commitUpdate(
      new DeleteSystemTokenMutation({
        projectId: this.props.projectId,
        tokenId: this.props.systemToken.id,
      }),
      {
        onFailure: (transaction) => onFailureShowNotification(transaction, this.context.showNotification),
      })
  }
}

export default Relay.createContainer(SystemTokenRow, {
  fragments: {
    systemToken: () => Relay.QL`
      fragment on SystemToken {
        id
        name
        token
      }
    `,
  },
})
