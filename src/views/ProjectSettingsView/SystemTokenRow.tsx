import * as React from 'react'
import * as Relay from 'react-relay'
import {SystemToken} from '../../types/types'
import Icon from '../../components/Icon/Icon'
import DeleteSystemTokenMutation from '../../mutations/DeleteSystemTokenMutation'
import {ShowNotificationCallback} from '../../types/utils'
import CopyToClipboard from 'react-copy-to-clipboard'
import {onFailureShowNotification} from '../../utils/relay'

const classes = require('./SystemTokenRow.scss')

interface Props {
  systemToken: SystemToken
  projectId: string
}

interface State {
  showFullToken: boolean
  isCopied: boolean
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
      showFullToken: false,
      isCopied: false,
    }
  }

  render() {

    return (
      <CopyToClipboard
        text={this.props.systemToken.token}
        onCopy={() => this.setState({isCopied: true} as State)}
      >
        <div
          className={classes.root}
          onMouseEnter={() => this.setState({showFullToken: true} as State)}
          onMouseLeave={() => this.setState({showFullToken: false} as State)}
        >
          <div className={classes.content}>
            <div className={classes.name}>
              {this.props.systemToken.name}
              {this.state.showFullToken &&
                <span className={classes.hint}>
                  {this.state.isCopied ? '(copied)' : '(click to copy)'}
                </span>
              }
            </div>
            <div className={classes.token}>
              {this.state.showFullToken ? this.props.systemToken.token : this.getTokenSuffix()}
            </div>
          </div>
          <Icon
            width={19}
            height={19}
            src={require('assets/icons/delete.svg')}
            onClick={this.deleteSystemToken}
          />
        </div>
      </CopyToClipboard>
    )
  }

  private getTokenSuffix = (): string => {
    // Getting the suffix because that's the only part that's changing
    const systemTokenSuffix = this.props.systemToken.token.split('.').reverse()[0]
    // We can change the style here in the future to make the text look 'cooler'
    return systemTokenSuffix
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
