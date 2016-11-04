import * as React from 'react'
import * as Relay from 'react-relay'
import {ModelPermission} from '../../../../types/types'
import {$p} from 'graphcool-styles'

interface Props {
  permission: ModelPermission
}

class ModelPermissionComponent extends React.Component<Props, {}> {
  render() {
    const {permission} = this.props
    return (
      <div className={$p.pa16}>
        <div>
          Operation: {permission.operation}
        </div>
        <div>
          User Type: {permission.userType}
        </div>
        <div>
          Field IDs: {permission.fieldIds.toString()}
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(ModelPermissionComponent, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    permission: () => Relay.QL`
      fragment on ModelPermission {
        operation
        userType
        fieldIds
      }
    `,
  },
})
