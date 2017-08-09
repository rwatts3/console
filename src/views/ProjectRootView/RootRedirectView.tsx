import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import * as cookiestore from 'cookiestore'
import { default as mapProps } from 'map-props'
import { Viewer } from '../../types/types'
const classes: any = require('./RootRedirectView.scss')
import AddProjectMutation from '../../mutations/AddProjectMutation'

interface Props {
  viewer: Viewer
  projectName: string
  router: InjectedFoundRouter
  location: any
}

class RootRedirectView extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props)
  }

  componentWillMount(): void {
    if (this.props.projectName) {
      const url = `/${this.props.projectName}${this.props.location.search}`
      this.props.router.replace(url)
    }
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    if (nextProps.projectName) {
      const url = `/${nextProps.projectName}${this.props.location.search}`
      this.props.router.replace(url)
      return false
    }

    return true
  }

  render() {
    if (!this.props.projectName) {
      return (
        <div className={classes.addProject} onClick={this.addProject}>
          Add new project
        </div>
      )
    }

    return <div>Redirecting...</div>
  }

  private addProject = (): void => {
    // TODO reimplement project prompt here
    const projectName = window.prompt('Project name')
    if (projectName) {
      AddProjectMutation.commit({
        projectName,
        customerId: this.props.viewer.user.id,
        region: 'US_WEST_2',
      }).then(() => {
        this.props.router.replace(
          `/${projectName}${this.props.location.search}`,
        )
      })
    }
  }
}

const MappedRootRedirectView = mapProps({
  viewer: props => props.viewer,
  projectName: props => {
    if (!props.viewer.user || props.viewer.user.projects.edges.length === 0) {
      return null
    }

    const projects = props.viewer.user.projects.edges.map(edge => edge.node)
    let project

    if (cookiestore.has('graphcool_last_used_project_id')) {
      project = projects.find(
        p => p.id === cookiestore.get('graphcool_last_used_project_id'),
      )
    }

    if (!project) {
      project = projects[0]
    }

    return project.name
  },
})(RootRedirectView)

export default createFragmentContainer(MappedRootRedirectView, {
  viewer: graphql`
    fragment RootRedirectView_viewer on Viewer {
      id
      user {
        id
        projects(first: 1000) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  `,
})
