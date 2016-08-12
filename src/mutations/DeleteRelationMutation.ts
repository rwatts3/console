import * as Relay from 'react-relay'
import {Project} from '../types/types'

interface Props {
  relationId: string
  projectId: string
  leftModelId: string
  rightModelId: string
}

interface DeleteRelationPayload {
  project: Project
  deletedId: string
}

export default class DeleteRelationMutation extends Relay.Mutation<Props, {}> {

    getMutation () {
        return Relay.QL`mutation{deleteRelation}`
    }

    getFatQuery () {
        return Relay.QL`
            fragment on DeleteRelationPayload {
                project
                deletedId
            }
        `
    }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'relations',
      deletedIDFieldName: 'deletedId',
    }, {
      type: 'NODE_DELETE',
      parentName: 'model',
      parentID: this.props.leftModelId,
      connectionName: 'fields',
      deletedIDFieldName: 'deletedId',
    }, {
      type: 'NODE_DELETE',
      parentName: 'model',
      parentID: this.props.rightModelId,
      connectionName: 'fields',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables() {
    return {
      relationId: this.props.relationId,
    }
  }

  getOptimisticResponse() {
    return {
      deletedId: this.props.relationId,
    }
  }
}
