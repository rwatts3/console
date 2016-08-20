import * as React from 'react'
import * as Relay from 'react-relay'
import Icon from '../../components/Icon/Icon'
import {ShowNotificationCallback} from '../../types/utils'
import {onFailureShowNotification} from '../../utils/relay'
import AddSystemTokenMutation from '../../mutations/AddSystemTokenMutation'

const classes = require('./SystemTokenRow.scss')

interface Props {
  projectId: string
}

interface State {
  newTokenName: string
}

export default class AddSystemTokenRow extends React.Component<Props, State> {

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
            <input
              value={this.state.newTokenName}
              onChange={(e) => this.setState({newTokenName: e.target.value})}
              onKeyDown={this.handleKeyDown}
              placeholder={'Add new token ...'}
            />
          </div>
        </div>
        {this.state.newTokenName !== '' &&
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

  private handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.addSystemToken()
    }
  }

  private addSystemToken = (): void => {
    if (!this.state.newTokenName) {
      return
    }
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
}
