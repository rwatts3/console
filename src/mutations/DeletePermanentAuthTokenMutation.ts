import * as Relay from 'react-relay'

interface Props {
  projectId: string
  tokenId: string
}

export default class DeletePermanentAuthTokenMutation extends Relay.Mutation<Props, {}> {

  getMutation() {
    return Relay.QL`mutation{deleteSystemToken}`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteSystemTokenPayload {
        deletedId
        project
      }
    `
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'systemTokens',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables() {
    return {
      systemTokenId: this.props.tokenId,
    }
  }

  getOptimisticResponse() {
    return {
      deletedId: this.props.tokenId,
    }
  }
}
