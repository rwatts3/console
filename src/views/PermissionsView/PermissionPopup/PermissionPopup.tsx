import * as React from 'react'
import * as Relay from 'react-relay'
import {$p} from 'graphcool-styles'
import * as cx from 'classnames'
import {Project, Operation, UserType, Model, ModelPermission} from '../../../types/types'
import mapProps from '../../../components/MapProps/MapProps'
import PopupWrapper from '../../../components/PopupWrapper/PopupWrapper'
import {withRouter} from 'react-router'
import styled from 'styled-components'
import PermissionPopupHeader from './PermissionPopupHeader'
import PermissionPopupFooter from './PermissionPopupFooter'
import OperationChooser from './OperationChooser'
import PermissionConditions from './PermissionConditions'
import AffectedFields from './AffectedFields'
import AddPermissionMutation from '../../../mutations/ModelPermission/AddPermissionMutation'
import UpdatePermissionMutation from '../../../mutations/ModelPermission/UpdatePermissionMutation'

interface Props {
  params: any
  project: Project
  children: JSX.Element
  router: ReactRouter.InjectedRouter
  model?: Model
  permission?: ModelPermission
}

interface State {
  selectedOperation: Operation
  fieldIds: string[]
  userType: UserType
  applyToWholeModel: boolean
}

const Container = styled.div`
  width: 700px;
`

class PermissionPopup extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    if (props.permission) {
      const {operation, fieldIds, userType, applyToWholeModel} = props.permission
      this.state = {
        selectedOperation: operation,
        fieldIds,
        userType,
        applyToWholeModel,
      }
      return
    }

    this.state = {
      selectedOperation: null,
      fieldIds: [],
      userType: 'EVERYONE' as UserType,
      applyToWholeModel: false,
    }
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

  toggleApplyToWholeModel = () => {
    const {applyToWholeModel} = this.state
    this.setState({applyToWholeModel: !applyToWholeModel} as State)
  }

  isValid = () => {
    return this.state.selectedOperation !== null
  }

  render() {
    const {params, model} = this.props
    const {selectedOperation, fieldIds, userType, applyToWholeModel} = this.state

    return (
      <PopupWrapper
        onClickOutside={this.closePopup}
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
            <PermissionPopupHeader
              operation={this.state.selectedOperation}
              editing={!!this.props.permission}
              params={params}
            />
            <OperationChooser selectedOperation={selectedOperation} setOperation={this.setOperation} />
            {(selectedOperation !== null && ['CREATE', 'READ', 'UPDATE'].includes(selectedOperation)) && (
              <AffectedFields
                selectedOperation={selectedOperation}
                model={model}
                fieldIds={fieldIds}
                toggleField={this.toggleField}
                toggleApplyToWholeModel={this.toggleApplyToWholeModel}
                applyToWholeModel={applyToWholeModel}
              />
            )}
            {selectedOperation !== null && (
              <PermissionConditions userType={userType} setUserType={this.setUserType} />
            )}
            <PermissionPopupFooter
              editing={!!this.props.permission}
              isValid={this.isValid()}
              onCancel={this.closePopup}
              onCreate={this.createPermission}
              onUpdate={this.updatePermission}
              params={params}
            />
          </Container>
        </div>
      </PopupWrapper>
    )
  }

  private updatePermission = () => {
    const {permission: {rule, isActive, id}} = this.props
    const {selectedOperation, fieldIds, userType, applyToWholeModel} = this.state

    const updatedNode = {
      id,
      operation: selectedOperation,
      fieldIds,
      userType,
      applyToWholeModel,
      rule,
      isActive,
    }

    Relay.Store.commitUpdate(
      new UpdatePermissionMutation(updatedNode),
      {
        onSuccess: () => this.closePopup(),
        onFailure: (transaction) => console.log(transaction),
      }
    )
  }

  private createPermission = () => {
    const {model} = this.props
    const {selectedOperation, fieldIds, userType, applyToWholeModel} = this.state

    Relay.Store.commitUpdate(
      new AddPermissionMutation({
        modelId: model.id,
        operation: selectedOperation,
        fieldIds,
        userType,
        applyToWholeModel,
      }),
      {
        onSuccess: () => this.closePopup(),
        onFailure: (transaction) => console.log(transaction),
      },
    )
  }

  private closePopup = () => {
    const {router, params} = this.props
    router.push(`/${params.projectName}/permissions`)
  }
}

const MappedPermissionPopup = mapProps({
  permission: props => props.node || null,
  model: props => (props.viewer && props.viewer.model) || props.node.model,
})(PermissionPopup)

export const EditPermissionPopup = Relay.createContainer(withRouter(MappedPermissionPopup), {
  fragments: {
    node: () => Relay.QL`
      fragment on Node {
        id
        ... on ModelPermission {
          applyToWholeModel
          fieldIds
          operation
          isActive
          rule
          userType
          model {
            ${AffectedFields.getFragment('model')}
          }
        }
      }
    `,
  },
})

export const AddPermissionPopup = Relay.createContainer(withRouter(MappedPermissionPopup), {
  initialVariables: {
    projectName: null, // injected from router
    modelName: null, // injected from router
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
