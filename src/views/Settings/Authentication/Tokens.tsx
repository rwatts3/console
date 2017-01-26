import * as React from 'react'
import {PermanentAuthToken, Project} from '../../../types/types'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import {$p} from 'graphcool-styles'
import AddPermanentAuthTokenMutation from '../../../mutations/AddPermanentAuthTokenMutation'
import * as Relay from 'react-relay'

interface State {
  isEnteringTokenName: boolean
  newTokenName: string
}

interface Props {
  authTokens: PermanentAuthToken[]
  projectId: string
  project: Project
}

class Tokens extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      isEnteringTokenName: false,
      newTokenName: '',
    }
  }

  render() {

    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .pt25, .ph25;
          }

          .addToken {
            @inherit: .flex, .pointer;
          }

          .circle {
            @inherit: .flex, .justifyCenter, .itemsCenter, .br100, .mr16, .hS25, .wS25;
            background-color: rgba(42,127,211,.2);
          }

          .addTokenText {
            @inherit: .f16, .o50;
            color: rgba(42,127,211,1);
          }

          .inputField {
            @inherit: .pl6, .f25, .fw3, .w100;
            color: rgba(42,127,211,1);
          }

          .inputContainer {
            @inherit: .flex;
          }

          .iconContainer {
            @inherit: .flex, .itemsCenter;
          }

          .icon {
            @inherit: .mh10;
          }

        `}</style>
        {this.props.authTokens.map((token) => (
          <div>{token.name}</div>
        ))}
        {this.state.isEnteringTokenName ?
          (
            <div className='inputContainer'>
              <input
                className='inputField'
                placeholder='Define a name for the token ...'
                value={this.state.newTokenName}
                onKeyDown={this.handleKeyDown}
                onChange={(e: any) => this.setState({newTokenName: e.target.value} as State)}
              />
              <div className='iconContainer'>
                <Icon
                  className={$p.mh10}
                  src={require('../../../assets/icons/cross_red.svg')}
                  width={15}
                  height={15}
                  onClick={() =>
                    this.setState({
                      isEnteringTokenName: false,
                    } as State)
                  }
                />
                <Icon
                  className={$p.mh10}
                  src={require('../../../assets/icons/confirm.svg')}
                  width={35}
                  height={35}
                  onClick={this.addPermanentAuthToken}
                />
              </div>
            </div>
          ) :
          (
            <div
              className='addToken'
              onClick={() => {
                this.setState({
                  isEnteringTokenName: true,
                } as State)
              }}
            >
              <div className='circle'>
                <Icon
                  src={require('../../../assets/icons/addFull.svg')}
                  width={12}
                  height={12}
                  color={'rgba(42,127,211,1)'}
                  stroke={true}
                  strokeWidth={8}
                />
              </div>
              <div className='addTokenText'>add permanent access token</div>
            </div>
          )
        }
      </div>
    )
  }

  private handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.addPermanentAuthToken()
    }
  }

  private addPermanentAuthToken = (): void => {
    if (!this.state.newTokenName) {
      return
    }
    Relay.Store.commitUpdate(
      new AddPermanentAuthTokenMutation({
        projectId: this.props.projectId,
        tokenName: this.state.newTokenName,
      }),
      {
        onSuccess: () => this.setState({newTokenName: ''} as State),
        onFailure: (transaction) => console.error('could not submit token, an error occured'),
      })
  }
}

export default Relay.createContainer(Tokens, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        permanentAuthTokens (first: 1000) {
          edges {
            node {
              id
              name
              token
            }
          }
        }
      }
    `,
  },
})
