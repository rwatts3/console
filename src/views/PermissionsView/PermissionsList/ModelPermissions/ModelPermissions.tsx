import * as React from 'react'
import * as Relay from 'react-relay'
import {Model} from '../../../../types/types'
import ModelPermissionsHeader from './ModelPermissionsHeader'
import ModelPermissionsList from './ModelPermissionsList'

interface Props {
  model: Model
}

class PermissionsList extends React.Component<Props, {}> {
  render() {
    const {model} = this.props
    return (
      <div>
        <h1>ModelPermissions</h1>
        <ModelPermissionsHeader model={model} />
        <ModelPermissionsList model={model} />
      </div>
    )
  }
}

export default Relay.createContainer(PermissionsList, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        ${ModelPermissionsHeader.getFragment('model')}
        ${ModelPermissionsList.getFragment('model')}
      }
    `,
  },
})
