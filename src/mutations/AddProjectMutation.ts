import { Region } from '../types/types'
import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'

interface Props {
  projectName: string
  customerId: string
  region: Region
}

const mutation = graphql`
  mutation AddProjectMutation($input: AddProjectInput!) {
    addProject(input: $input) {
      projectEdge {
        node {
          id
        }
      }
      user {
        projects(first: 1000) {
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
    variables: {
      name: props.projectName,
      region: props.region,
    },
    configs: [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: props.customerId,
      connectionName: 'projects',
      edgeName: 'projectEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }],
  })
}

export default {commit}
