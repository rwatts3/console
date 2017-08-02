import * as React from 'react'
import { Viewer } from '../../../types/types'
import ProjectInfo from './ProjectInfo'
import { createFragmentContainer, graphql } from 'react-relay'
import DangerZone from './DangerZone'

interface Props {
  viewer: Viewer
}

class General extends React.Component<Props, {}> {
  render() {
    return (
      <div className="container">
        <style jsx={true}>{`
          .container {
            @inherit: .br;
            max-width: 700px;
            border-color: rgba(229, 229, 229, 1);
          }
        `}</style>
        <ProjectInfo project={this.props.viewer.project} />
        <DangerZone
          viewer={this.props.viewer}
          project={this.props.viewer.project}
        />
      </div>
    )
  }
}

export default createFragmentContainer(General, {
  viewer: graphql`
    fragment General_viewer on Viewer {
      ...DangerZone_viewer
      project: projectByName(projectName: $projectName) {
        ...DangerZone_project
        ...ProjectInfo_project
        name
      }
    }
  `,
})
