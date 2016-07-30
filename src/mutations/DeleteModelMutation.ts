import * as Relay from 'react-relay'

interface Props {
  modelId: string
  projectId: string
}

export default class DeleteModelMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{deleteModel}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DeleteModelPayload {
        project
        deletedId
      }
    `
  }

  getConfigs () {
    return [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'models',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables () {
    return {
      modelId: this.props.modelId,
    }
  }

  getOptimisticResponse () {
    return {
      deletedId: this.props.modelId,
    }
  }
}
