import * as Relay from 'react-relay'

interface Props {
  projectName: string
  userId: string
}

export default class AddProjectMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{addProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddProjectPayload {
        projectEdge
        user
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.userId,
      connectionName: 'projects',
      edgeName: 'projectEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      name: this.props.projectName,
    }
  }
}
