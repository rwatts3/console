import * as Relay from 'react-relay'
import {UserType, Operation} from '../../types/types'

interface Props {
  modelId: string
  operation: Operation
  userType: UserType
  fieldIds: string[]
  applyToWholeModel: boolean
}

interface Response {
}

export default class AddPermissionMutation extends Relay.Mutation<Props, Response> {

  getMutation () {
    return Relay.QL`mutation{addModelPermission}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddModelPermissionPayload {
        modelPermissionEdge 
        model
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'model',
      parentID: this.props.modelId,
      connectionName: 'permissions',
      edgeName: 'modelPermissionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getOptimisticResponse () {
    return {
      modelPermission: Object.assign({}, this.props, {
        isActive: true,
        rule: 'NONE',
      }),
    }
  }

  getVariables () {
    const {modelId, operation, userType, fieldIds, applyToWholeModel} = this.props

    return {
      modelId,
      operation,
      userType,
      fieldIds,
      applyToWholeModel,
      isActive: true,
      rule: 'NONE',
    }
  }
}
