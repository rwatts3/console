import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import IntegrationsCardGrid from './IntegrationsCardGrid/IntegrationsCardGrid'

export default class IntegrationsView extends React.Component<{}, {}> {

  render() {
    return (
      <div>
        <Helmet title='Integrations' />
        <IntegrationsCardGrid />
      </div>
    )
  }

}

/* 
export default Relay.createContainer(IntegrationsView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          ${PermissionsList.getFragment('project')}
        }
      }
    `,
  }
}) 
*/
