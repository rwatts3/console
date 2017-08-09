import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { Relation } from '../../../../types/types'
import RelationPermissionHeader from './RelationPermissionHeader'
import RelationPermissionList from './RelationPermissionList'
import { $p, variables } from 'graphcool-styles'
import * as cx from 'classnames'
import styled from 'styled-components'

interface Props {
  relation: Relation
  params: any
  style: any
}

const Container = styled.div`
  &:before {
    width: 100%;
    height: 1px;
    position: absolute;
    border-bottom: 1px solid ${variables.gray07};
    top: 19px;
    content: "";
    z-index: -1;
  }
`

class RelationPermissions extends React.Component<Props, {}> {
  render() {
    const { relation, params, style } = this.props
    return (
      <Container
        className={cx($p.mt38, $p.mb16, $p.relative, $p.z5)}
        style={style}
      >
        <div className={$p.ph16}>
          <RelationPermissionHeader params={params} relation={relation} />
          <RelationPermissionList params={params} relation={relation} />
        </div>
      </Container>
    )
  }
}

export default createFragmentContainer(RelationPermissions, {
  relation: graphql`
    fragment RelationPermissions_relation on Relation {
      id
      name
      ...RelationPermissionList_relation
    }
  `,
})
