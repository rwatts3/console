import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import mapProps from '../../components/MapProps/MapProps'
import {Project} from '../../types/types'
import PermissionsList from './PermissionsList/PermissionsList'
import PermissionsHeader from './PermissionsHeader/PermissionsHeader'
import AllRelationPermissionsList from './RelationPermissionsList/AllRelationPermissionsList'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'
import tracker from '../../utils/metrics'
import {ConsoleEvents} from 'graphcool-metrics'

interface Props {
  params: any
  project: Project
  children: JSX.Element
}

interface State {
  activeTab: number
}

class PermissionsView extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 0,
    }
  }
  componentDidMount() {
    tracker.track(ConsoleEvents.Permissions.viewed())
  }
  render() {
    const {project, params} = this.props
    const {activeTab} = this.state
    return (
      <div
        className={cx(
          $p.flex,
          $p.flexColumn,
          $p.bgBlack04,
        )}
      >
        <Helmet title='Permissions'/>
        <PermissionsHeader activeTab={activeTab} onChangeTab={this.handleTabChange} />
        {activeTab === 0 && (
          <PermissionsList params={params} project={project} />
        )}
        {activeTab === 1 && (
          <AllRelationPermissionsList params={params} project={project} />
        )}
        {this.props.children}
      </div>
    )
  }

  private handleTabChange = i => {
    this.setState({activeTab: i})
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
          ${AllRelationPermissionsList.getFragment('project')}
        }
      }
    `,
  },
})
