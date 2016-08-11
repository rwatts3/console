import * as Relay from 'react-relay'

interface Props {
  projectId: string
  name: string
  description?: string
  leftModelId: string
  rightModelId: string
  fieldOnLeftModelName: string
  fieldOnRightModelName: string
  fieldOnLeftModelIsList: boolean
  fieldOnRightModelIsList: boolean
}

export default class AddRelationMutation extends Relay.Mutation<Props, {}> {

    getMutation () {
        return Relay.QL`mutation{addRelation}`
    }

    getFatQuery () {
        return Relay.QL`
            fragment on AddRelationPayload {
                relation
                project {
                    relations (first: 10000) {
                        edges {
                            node 
                        }
                    }
                }
            }
        `
    }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'relations',
      edgeName: 'relationEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return this.props
  }
}
