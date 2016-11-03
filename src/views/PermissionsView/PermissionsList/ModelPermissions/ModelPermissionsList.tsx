import * as React from 'react'
import * as Relay from 'react-relay'
import mapProps from '../../../../components/MapProps/MapProps'
import {ModelPermission} from '../../../../types/types'
import ModelPermissionComponent from './ModelPermission'

interface Props {
  permissions: ModelPermission[]
}

// const sort = {
//   READ: 0,
//   CREATE: 1,
//   UPDATE: 2,
//   DELETE: 3,
// }

class ModelPermissionsList extends React.Component<Props, {}> {
  render() {
    const {permissions} = this.props
    return (
      <div>
        <h1>ModelPermissionsList</h1>
        {permissions.map(permission =>
          <ModelPermissionComponent key={permission.id} permission={permission} />
        )}
      </div>
    )
  }
}

const MappedPermissionsList = mapProps({
  permissions: props => props.model.permissions.edges.map(edge => edge.node),
})(ModelPermissionsList)

export default Relay.createContainer(MappedPermissionsList, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        permissions(first: 100) {
          edges {
            node {
              id
              ${ModelPermissionComponent.getFragment('permission')}
            }
          }
        }
      }
    `,
  },
})
