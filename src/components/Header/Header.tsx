import * as React from 'react'
import * as Relay from 'react-relay'
import { Project } from '../../types/types'
const classes: any = require('./Header.scss')

interface Props {
  children: Element
  viewer: any
  project: Project
  params: any
  renderRight?: () => JSX.Element
}

interface State {
  userDropdownVisible: boolean
  endpointLayoverVisible: boolean
}

class Header extends React.Component<Props, State> {

  state = {
    userDropdownVisible: false,
    endpointLayoverVisible: false,
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.left}>
          {this.props.children}
        </div>
        <div className={classes.right}>
          {typeof this.props.renderRight === 'function' && (
            this.props.renderRight()
          )}
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(Header, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          name
        }
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
      }
    `,
  },
})
