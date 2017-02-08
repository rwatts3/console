import * as Relay from 'react-relay'

interface Props {
  projectId: string
  email: string
}

export default class DeleteCollaboratorMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{removeCollaborator}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on RemoveCollaboratorPayload {
        deletedId
      }
    `
  }

  getConfigs () {
    return [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'seats',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables () {
    return {
      projectId: this.props.projectId,
      email: this.props.email,
    }
  }
}
