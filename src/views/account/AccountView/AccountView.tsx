import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Viewer, Project } from '../../../types/types'
import Header from '../../../components/Header/Header'
const classes: any = require('./AccountView.scss')

interface Props {
  viewer: Viewer & { project: Project }
  children: Element
  params: any
}

class AccountView extends React.Component<Props, {}> {

  render () {
    return (
      <div className={classes.root}>
        <Header
          viewer={this.props.viewer}
          params={this.props.params}
          project={this.props.viewer.project}
        >
          <div>Account</div>
        </Header>
        {this.props.children}
      </div>
    )
  }
}

export default createFragmentContainer(AccountView, {
  /* TODO manually deal with:
  initialVariables: {
    projectName: null, // injected from router
  }
  */
  viewer: graphql`
    fragment AccountView_viewer on Viewer {
      project: projectByName(projectName: $projectName) {
        ...Header_project
      }
      ...Header_viewer
    }
  `,
})
