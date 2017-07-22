import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import mapProps from '../../../../components/MapProps/MapProps'
import {ModelPermission, Model} from '../../../../types/types'
import ModelPermissionComponent from './ModelPermission'
import {$p} from 'graphcool-styles'

interface Props {
  permissions: ModelPermission[]
  model: Model
  params: any
}
// const sort = {
//   READ: 0,
//   CREATE: 1,
//   UPDATE: 2,
//   DELETE: 3,
// }

class ModelPermissionsList extends React.Component<Props, {}> {
  render() {
    const {permissions, model, params} = this.props
    return (
      <div className={$p.pa16}>
        {permissions.map(permission =>
          <ModelPermissionComponent
            key={permission.id}
            permission={permission}
            model={model}
            params={params}
          />,
        )}
      </div>
    )
  }
}

const MappedPermissionsList = mapProps({
  permissions: props => props.model.permissions.edges.map(edge => edge.node),
  model: props => props.model,
})(ModelPermissionsList)

export default createFragmentContainer(MappedPermissionsList, {
  model: graphql`
    fragment ModelPermissionList_model on Model {
      permissions(first: 100) {
        edges {
          node {
            id
            ...ModelPermissionComponent_permission
          }
        }
      }
      ...ModelPermissionComponent_model
    }
  `,
})
