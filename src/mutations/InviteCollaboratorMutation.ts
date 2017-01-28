import * as Relay from 'react-relay'

interface Props {
  projectId: string
  email: string
}

export default class InviteCollaboratorMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{inviteCollaborator}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on InviteCollaboratorPayload {
        seat {
          email
        }
      }
    `
  }

  getConfigs () {
    return []
  }

  getVariables () {
    return {
      projectId: this.props.projectId,
      email: this.props.email,
    }
  }
}
