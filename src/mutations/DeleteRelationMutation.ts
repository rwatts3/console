import * as Relay from 'react-relay/classic'
import {Project} from '../types/types'
import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

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

const mutation = graphql`
  mutation DeleteRelationMutation($input: DeleteRelationInput!) {
    deleteRelation(input: $input) {
      project {
        id
      }
      deletedId
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      relationId: props.relationId,
    },
    configs: [{
      type: 'NODE_DELETE',
      parentName: 'project',
      parentID: props.projectId,
      connectionName: 'relations',
      deletedIDFieldName: 'deletedId',
    }],
  })
}

export default { commit }
