import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import mapProps from '../../components/MapProps/MapProps'
import {Project} from '../../types/types'
import PermissionsList from './PermissionsList/PermissionsList'
import PermissionsHeader from './PermissionsHeader/PermissionsHeader'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'

interface Props {
  params: any
  project: Project
  children: JSX.Element
}

class PermissionsView extends React.Component<Props, {}> {
  render() {
    const {project, params} = this.props
    return (
      <div
        className={cx(
          $p.flex,
          $p.flexColumn,
          $p.bgBlack04,
        )}
      >
        <Helmet title='Permissions'/>
        <PermissionsHeader />
        <PermissionsList params={params} project={project} />
        {this.props.children}
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
