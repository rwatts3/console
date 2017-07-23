import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

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
  fieldOnLeftModelIsRequired: boolean
  fieldOnRightModelIsRequired: boolean
}

const mutation = graphql`
  mutation AddRelationMutation($input: AddRelationInput!) {
    addRelation(input: $input) {
      relation {
        id
      }
      leftModel {
        id
      }
      rightModel {
        id
      }
      project {
        relations(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: props.projectId,
      connectionName: 'relations',
      edgeName: 'relationEdge',
      rangeBehaviors: {'': 'append'},
    }, {
      type: 'RANGE_ADD',
      parentName: 'leftModel',
      parentID: props.leftModelId,
      connectionName: 'fields',
      edgeName: 'fieldOnLeftModelEdge',
      rangeBehaviors: {'': 'append'},
    }, {
      type: 'RANGE_ADD',
      parentName: 'rightModel',
      parentID: props.rightModelId,
      connectionName: 'fields',
      edgeName: 'fieldOnRightModelEdge',
      rangeBehaviors: {'': 'append'},
    }]
  })
}

export default { commit }
