import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { Relation, RelationPermission } from '../../../../types/types'
import { $p, variables, Icon } from 'graphcool-styles'
import * as cx from 'classnames'
import NewToggleButton from '../../../../components/NewToggleButton/NewToggleButton'
import RelationPermissionLabel from './RelationPermissionLabel'
import styled from 'styled-components'
import { Link, withRouter } from 'found'
import tracker from '../../../../utils/metrics'
import { ConsoleEvents } from 'graphcool-metrics'
import UpdateRelationPermission from '../../../../mutations/RelationPermission/UpdateRelationPermission'

interface Props {
  permission: RelationPermission
  relation: Relation
  params: any
}

const Container = styled.div`height: 60px;`

const PermissionType = styled.div`
  width: 170px;
  min-width: 170px;
`

const Arrow = styled.div`
  &:before {
    width: calc(100% - 20px);
    height: 1px;
    position: absolute;
    border-bottom: 1px solid ${variables.gray20};
    top: 3px;
    right: 7px;
    content: "";
  }
`

class RelationPermissionComponent extends React.Component<Props, {}> {
  render() {
    const { permission, relation, params: { projectName } } = this.props
    return (
      <div>
        <Container
          className={cx($p.flex, $p.flexRow, $p.justifyBetween, $p.itemsCenter)}
        >
          <Link
            className={cx(
              $p.flex,
              $p.flexRow,
              $p.overflowHidden,
              $p.flex1,
              $p.itemsCenter,
            )}
            to={`/${projectName}/permissions/relations/${relation.name}/edit/${permission.id}`}
          >
            <PermissionType
              className={cx(
                $p.flex,
                $p.flexRow,
                $p.itemsCenter,
                $p.justifyBetween,
                $p.relative,
              )}
            >
              <Arrow
                className={cx(
                  $p.justifyEnd,
                  $p.flex,
                  $p.flexRow,
                  $p.flexAuto,
                  $p.relative,
                )}
              >
                <Icon
                  src={require('graphcool-styles/icons/fill/triangle.svg')}
                  color={variables.gray20}
                  width={6}
                  height={7}
                />
              </Arrow>
            </PermissionType>
            {permission.connect &&
              <RelationPermissionLabel
                isActive={permission.isActive}
                operation="connect"
                className={$p.ml10}
              />}
            {permission.disconnect &&
              <RelationPermissionLabel
                isActive={permission.isActive}
                operation="disconnect"
                className={$p.ml10}
              />}
          </Link>
          <div>
            <NewToggleButton
              defaultChecked={permission.isActive}
              onChange={this.toggleActiveState}
            />
          </div>
        </Container>
        <h3 className={cx($p.black50, $p.f16, $p.fw6)}>
          {permission.ruleName
            ? permission.ruleName
            : permission.userType === 'EVERYONE' ? 'Everyone' : 'Authenticated'}
        </h3>
      </div>
    )
  }

  private toggleActiveState = () => {
    const { permission } = this.props
    UpdateRelationPermission.commit({
      id: permission.id,
      isActive: !permission.isActive,
    })
    tracker.track(
      ConsoleEvents.Permissions.toggled({ active: !permission.isActive }),
    )
  }
}

export default createFragmentContainer(
  withRouter(RelationPermissionComponent),
  {
    permission: graphql`
      fragment RelationPermissionComponent_permission on RelationPermission {
        id
        userType
        connect
        disconnect
        ruleName
        isActive
      }
    `,
    relation: graphql`
      fragment RelationPermissionComponent_relation on Relation {
        id
        name
      }
    `,
  },
)
