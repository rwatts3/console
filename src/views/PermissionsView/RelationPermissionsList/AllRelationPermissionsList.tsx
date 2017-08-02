import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { Model, Relation } from '../../../types/types'
import mapProps from '../../../components/MapProps/MapProps'
import RelationPermissions from './RelationPermissions/RelationPermissions'
import { $p } from 'graphcool-styles'
import * as cx from 'classnames'

interface Props {
  relations: Relation[]
  params: any
}

class AllRelationPermissionsList extends React.Component<Props, {}> {
  render() {
    const { relations, params } = this.props
    return (
      <div className={cx($p.bgWhite, $p.bt, $p.bBlack10, $p.b)}>
        {relations.map((relation, index) =>
          <RelationPermissions
            params={params}
            key={relation.id}
            relation={relation}
            style={
              index === relations.length - 1
                ? {
                    marginBottom: 100,
                  }
                : {}
            }
          />,
        )}
        {this.props.children}
      </div>
    )
  }
}

const MappedAllPermissionsList = mapProps({
  relations: props => props.project.relations.edges.map(edge => edge.node),
})(AllRelationPermissionsList)

export default createFragmentContainer(MappedAllPermissionsList, {
  project: graphql`
    fragment AllRelationPermissionsList_project on Project {
      name
      relations(first: 1000) {
        edges {
          node {
            id
            ...RelationPermissions_relation
          }
        }
      }
    }
  `,
})
