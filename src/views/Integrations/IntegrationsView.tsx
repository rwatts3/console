import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'

interface Props {
  isEnabled: boolean
}

export default class IntegrationsView extends React.Component<Props, {}> {

  render() {
    return (
      <div>
        <Helmet title='Integrations' />
        I'm the Integrations view!
      </div>
    );
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
