import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import mapProps from '../../../components/MapProps/MapProps'
import {Model} from '../../../types/types'

interface Props {
  params: any
  router: ReactRouter.InjectedRouter
  models: Model[]
}

class PermissionsView extends React.Component<Props, {}> {
  render() {
    return (
      <div>
        <Helmet title='Permissions'/>
      </div>
    )
  }
}

const MappedPermissionsView = mapProps({
  params: (props) => props.params,
})(PermissionsView)

export default Relay.createContainer(MappedPermissionsView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          models(first: 100) {
            edges {
              node {
                name
                itemCount
              }
            }
          }
        }
      }
    `,
  },
})
