import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import mapProps from '../../../../components/MapProps/MapProps'
import { ModelPermission, Relation } from '../../../../types/types'
import RelationPermissionComponent from './RelationPermissionComponent'
import { $p } from 'graphcool-styles'

interface Props {
  permissions: ModelPermission[]
  relation: Relation
  params: any
}

class RelationPermissionList extends React.Component<Props, {}> {
  render() {
    const { permissions, relation, params } = this.props
    return (
      <div className={$p.pa16}>
        {permissions.map(permission =>
          <RelationPermissionComponent
            key={permission.id}
            permission={permission}
            relation={relation}
            params={params}
          />,
        )}
        {this.props.children}
      </div>
    )
  }
}

const MappedPermissionsList = mapProps({
  permissions: props => props.relation.permissions.edges.map(edge => edge.node),
  relation: props => props.relation,
})(RelationPermissionList)

export default createFragmentContainer(MappedPermissionsList, {
  relation: graphql`
    fragment RelationPermissionList_relation on Relation {
      permissions(first: 1000) {
        edges {
          node {
            id
            ...RelationPermissionComponent_permission
          }
        }
      }
      ...RelationPermissionComponent_relation
    }
  `,
})
