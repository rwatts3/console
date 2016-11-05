import * as React from 'react'
import * as Relay from 'react-relay'
import {ModelPermission, Model} from '../../../../types/types'
import {$p, variables, Icon} from 'graphcool-styles'
import * as cx from 'classnames'
import NewToggleButton from './NewToggleButton'
import PermissionLabel from './PermissionLabel'
import ModelPermissionFields from './ModelPermissionFields'
import styled from 'styled-components'

interface Props {
  permission: ModelPermission
  model: Model
}

const Container = styled.div`
  height: 60px;
  &:not(:last-child) {
    border-bottom: 1px solid ${variables.gray07};
  }
`

const PermissionType = styled.div`
  width: 170px;
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

class ModelPermissionComponent extends React.Component<Props, {}> {
  render() {
    const {permission, model} = this.props
    return (
      <Container className={cx(
        $p.flex,
        $p.flexRow,
        $p.justifyBetween,
        $p.itemsCenter,
      )}>
        <div className={cx($p.flex, $p.flexRow)}>
          <PermissionType className={cx(
            $p.flex,
            $p.flexRow,
            $p.itemsCenter,
            $p.justifyBetween,
            $p.relative,
          )}>
            <h3 className={cx($p.black50, $p.f16)}>
              {permission.userType === 'PUBLIC' ? 'Everyone' : 'Authenticated'}
            </h3>
            <Arrow className={cx(
              $p.justifyEnd,
              $p.flex,
              $p.flexRow,
              $p.flexAuto,
              $p.relative,
            )}>
              <Icon
                src={require('graphcool-styles/icons/fill/triangle.svg')}
                color={variables.gray20}
                width={6}
                height={7}
              />
            </Arrow>
          </PermissionType>
          <PermissionLabel isActive={permission.isActive} operation={permission.operation} className={$p.ml10} />
          {['READ', 'CREATE', 'UPDATE'].includes(permission.operation) && (
            <ModelPermissionFields permission={permission} model={model} />
          )}
        </div>
        <div>
          <NewToggleButton defaultChecked={permission.isActive} />
        </div>
      </Container>
    )
  }
}

export default Relay.createContainer(ModelPermissionComponent, {
  fragments: {
    permission: () => Relay.QL`
      fragment on ModelPermission {
        operation
        userType
        fieldIds
        isActive
        ${ModelPermissionFields.getFragment('permission')}
      }
    `,
    model: () => Relay.QL`
      fragment on Model {
        ${ModelPermissionFields.getFragment('model')}
      }
    `,
  },
})
