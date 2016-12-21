import * as Relay from 'react-relay'
import {pick} from 'lodash'

interface Props {
  modelId: string
  indexName: string
  fragment: string
  searchProviderAlgoliaId: string
}

export default class AddAlgoliaSyncQueryMutation extends Relay.Mutation<Props, Response> {

  getMutation() {
    return Relay.QL`mutation{addAlgoliaSyncQuery}`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddAlgoliaSyncQueryPayload {
        searchProviderAlgolia
        algoliaSyncQueryEdge     
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'searchProviderAlgolia',
      parentID: this.props.searchProviderAlgoliaId,
      connectionName: 'algoliaSyncQueries',
      edgeName: 'algoliaSyncQueryEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables() {
    return pick(this.props, ['modelId', 'indexName', 'fragment'])
  }
}
