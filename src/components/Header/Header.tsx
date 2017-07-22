import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Project } from '../../types/types'
const classes: any = require('./Header.scss')

interface Props {
  children: Element
  viewer: any
  project: Project
  params: any
  left?: boolean
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
    let { left } = this.props

    if (typeof left !== 'boolean') {
      left = true
    }
    return (
      <div className={classes.root}>
        {left ? (
          <div className={classes.left}>
            {this.props.children}
          </div>
        ) : (
          this.props.children
        )}
      </div>
    )
  }
}

export default createFragmentContainer(Header, {
  viewer: graphql`
    fragment Header_viewer on Viewer {
      user {
        id
        name
      }
    }
  `,
  project: graphql`
    fragment Header_project on Project {
      id
    }
  `,
})
