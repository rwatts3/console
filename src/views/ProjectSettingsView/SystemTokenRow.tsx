import * as React from 'react'
import * as Relay from 'react-relay'
import {SystemToken} from '../../types/types'
import Icon from '../../components/Icon/Icon'

const classes = require('./SystemTokenRow.scss')

interface Props {
  systemToken: SystemToken
  projectId: string
}

class SystemTokenRow extends React.Component<Props,{}> {
  render() {
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.name}>
            {this.props.systemToken.name}
          </div>
          <div className={classes.token}>
            {this.props.systemToken.token.split('.').reverse()[0]}
          </div>
        </div>
        <Icon
          width={19}
          height={19}
          src={require('assets/icons/delete.svg')}
        />
      </div>
    )
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
