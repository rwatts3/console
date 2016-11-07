import * as React from 'react'
import * as Relay from 'react-relay'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'
import {Project, Operation, UserType, Model} from '../../../types/types'
import mapProps from '../../../components/MapProps/MapProps'
import PopupWrapper from '../../../components/PopupWrapper/PopupWrapper'
import {withRouter} from 'react-router'
import styled from 'styled-components'
import PermissionPopupHeader from './PermissionPopupHeader'
import PermissionPopupFooter from './PermissionPopupFooter'
import OperationChooser from './OperationChooser'
import PermissionConditions from './PermissionConditions'
import AffectedFields from './AffectedFields'

interface Props {
  params: any
  project: Project
  children: JSX.Element
  router: ReactRouter.InjectedRouter
  model: Model
}

interface State {
  selectedOperation: Operation
  fieldIds: string[]
  userType: UserType
}

const Container = styled.div`
  width: 700px;
`

class PermissionPopup extends React.Component<Props, State> {
  state = {
    selectedOperation: null,
    fieldIds: [],
    userType: 'EVERYONE' as UserType,
  }

  setOperation = (operation: Operation) => {
    this.setState({selectedOperation: operation} as State)
  }

  toggleField = (id: string) => {
    if (!this.state.fieldIds.includes(id)) {
      const fieldIds = this.state.fieldIds.concat(id)
      this.setState({fieldIds} as State)
    } else {
      const i = this.state.fieldIds.indexOf(id)

      const fieldIds = this.state.fieldIds.slice()
      fieldIds.splice(i, 1)

      this.setState({fieldIds} as State)
    }
  }

  setUserType = (userType: UserType) => {
    this.setState({userType} as State)
  }

  isValid = () => {
    return this.state.selectedOperation !== null
  }

  render() {
    const {params, model} = this.props
    const {selectedOperation, fieldIds, userType} = this.state
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
              $p.overflowXHidden,
            )}
          >
            <PermissionPopupHeader params={params} />
            <OperationChooser selectedOperation={selectedOperation} setOperation={this.setOperation} />
            {(selectedOperation !== null && ['CREATE', 'READ', 'UPDATE'].includes(selectedOperation)) && (
              <AffectedFields
                selectedOperation={selectedOperation}
                model={model}
                fieldIds={fieldIds}
                toggleField={this.toggleField}
              />
            )}
            {selectedOperation !== null && (
              <PermissionConditions userType={userType} setUserType={this.setUserType} />
            )}
            <PermissionPopupFooter
              isValid={this.isValid()}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
              params={params}
            />
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

const MappedPermissionPopup = mapProps({
  model: props => props.viewer.model,
})(withRouter(PermissionPopup))

export default Relay.createContainer(MappedPermissionPopup, {
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
          ${AffectedFields.getFragment('model')}
        }
      }
    `,
  },
})
