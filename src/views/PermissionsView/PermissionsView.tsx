import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import mapProps from '../../components/MapProps/MapProps'
import {Project} from '../../types/types'
import PermissionsList from './PermissionsList/PermissionsList'
import PermissionsHeader from './PermissionsHeader/PermissionsHeader'

interface Props {
  params: any
  router: ReactRouter.InjectedRouter
  project: Project
}

class PermissionsView extends React.Component<Props, {}> {
  render() {
    const {project} = this.props

    return (
      <div>
        <Helmet title='Permissions'/>
        <PermissionsHeader />
        <PermissionsList project={project} />
      </div>
    )
  }
}

const MappedPermissionsView = mapProps({
  project: props => props.viewer.project,
})(PermissionsView)

export default Relay.createContainer(MappedPermissionsView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          ${PermissionsList.getFragment('project')}
        }
      }
    `,
  },
})
