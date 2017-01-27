import * as React from 'react'
import {Viewer} from '../../../types/types'
import ProjectInfo from './ProjectInfo'
import * as Relay from 'react-relay'
import DangerZone from './DangerZone'

interface Props {
  viewer: Viewer
  params: any
}

class General extends React.Component<Props, {}> {

  render() {
    return (
      <div>
        <ProjectInfo
          project={this.props.viewer.project}
        />
        <DangerZone
          viewer={this.props.viewer}
          params={this.props.params}
        />
      </div>
    )
  }
}

export default Relay.createContainer(General, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${DangerZone.getFragment('viewer')},
        project: projectByName(projectName: $projectName) {
          ${ProjectInfo.getFragment('project')}   
        }
      }
    `,
  },
})