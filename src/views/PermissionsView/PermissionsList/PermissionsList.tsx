import * as React from 'react'
import * as Relay from 'react-relay'
import {Model} from '../../../types/types'
import mapProps from '../../../components/MapProps/MapProps'
import ModelPermissions from './ModelPermissions/ModelPermissions'

interface Props {
  models: Model[]
}

class PermissionsList extends React.Component<Props, {}> {
  render() {
    const {models} = this.props
    return (
      <div>
        <h1>PermissionsList</h1>
        {models.map(model =>
          <ModelPermissions key={model.id} model={model}/>
        )}
      </div>
    )
  }
}

const MappedPermissionsList = mapProps({
  models: props => props.project.models.edges.map(edge => edge.node),
})(PermissionsList)

export default Relay.createContainer(MappedPermissionsList, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        models(first: 100) {
          edges {
            node {
              id
              ${ModelPermissions.getFragment('model')}
            }
          }
        }
      }
    `,
  },
})
