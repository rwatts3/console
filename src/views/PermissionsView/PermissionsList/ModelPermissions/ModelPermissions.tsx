import * as React from 'react'
import * as Relay from 'react-relay'
import {Model} from '../../../../types/types'
import ModelPermissionsHeader from './ModelPermissionsHeader'
import ModelPermissionsList from './ModelPermissionList'
import {$p, variables} from 'graphcool-styles'
import * as cx from 'classnames'
import styled from 'styled-components'

interface Props {
  model: Model
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

class PermissionsList extends React.Component<Props, {}> {
  render() {
    const {model} = this.props
    return (
      <Container className={cx($p.mt38, $p.mb16, $p.relative, $p.z5)}>
        <div className={$p.ph16}>
          <ModelPermissionsHeader model={model} />
          <ModelPermissionsList model={model} />
        </div>
      </Container>
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
