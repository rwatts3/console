import * as React from 'react'
import * as Relay from 'react-relay'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'
import {Project} from '../../../types/types'
import mapProps from '../../../components/MapProps/MapProps'
import PopupWrapper from '../../../components/PopupWrapper/PopupWrapper'
import {withRouter} from 'react-router'
import styled from 'styled-components'
import PermissionPopupHeader from './PermissionPopupHeader'
import PermissionPopupFooter from './PermissionPopupFooter'

interface Props {
  params: any
  project: Project
  children: JSX.Element
  router: ReactRouter.InjectedRouter
}

const Container = styled.div`
  width: 700px;
`

class PermissionsView extends React.Component<Props, {}> {
  render() {
    const {params} = this.props
    return (
      <PopupWrapper
        onClickOutside={this.handleCancel}
      >
        <div
          className={cx(
            $p.flex,
            $p.justifyCenter,
            $p.itemsCenter,
            $p.h100,
            $p.bgWhite50,
          )}
        >
          <Container
            className={cx(
              $p.bgWhite,
              $p.br2,
              $p.flex,
              $p.buttonShadow,
              $p.flexColumn,
            )}
          >
            <PermissionPopupHeader params={params} />
            <PermissionPopupFooter onCancel={this.handleCancel} onCreate={this.handleCreate} params={params} />
          </Container>
        </div>
      </PopupWrapper>
    )
  }

  private handleCreate = () => {
    // do stuff :)
  }

  private handleCancel = () => {
    const {router, params} = this.props
    router.push(`/${params.projectName}/permissions`)
  }
}

const MappedPermissionsView = mapProps({
  model: props => props.viewer.model,
})(withRouter(PermissionsView))

export default Relay.createContainer(MappedPermissionsView, {
  initialVariables: {
    projectName: null, // injected from router
    modelName: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          id
          name
        }
      }
    `,
  },
})
