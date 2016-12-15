import * as Relay from 'react-relay'
import {Field, RelayConnection} from '../types/types'
import {isScalar} from '../utils/graphql'

interface Props {
  modelId: string
  projectId: string
  fields: RelayConnection<Field>
}

export interface RelationData {
  relatedModelId: string
  reverseRelationFieldId: string
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
    const {fields} = this.props

    const modelDelete = {
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'models',
      deletedIDFieldName: 'deletedId',
    }

    let configs = [modelDelete]

    // fields
    //   .filter(field => !isScalar(field.typeIdentifier))
    //   .forEach(field => {
    //     const config = {
    //       type: 'NODE_DELETE',
    //       parentName: 'project.models.edges.node',
    //       parentID: this.props.projectId,
    //       connectionName: 'models',
    //       deletedIDFieldName: 'deletedId',
    //     }
    //   })

    return configs
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
