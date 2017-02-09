
import * as Relay from 'react-relay'

interface Props {
  projectId: string
  token: string
}

export default class SetCreditCardMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{setCreditCard}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on SetCreditCardPayload {
        user {
          name
        }
      }
    `
  }

  getConfigs () {
    return [
      // type: 'RANGE_ADD',
      // parentName: 'project',
      // parentID: this.props.projectId,
      // connectionName: 'seats',
      // edgeName: 'seatEdge',
      // rangeBehaviors: {
      //   '': 'append',
      // },
    ]
  }

  getVariables () {
    return {
      projectId: this.props.projectId,
      token: this.props.token,
    }
  }
}
