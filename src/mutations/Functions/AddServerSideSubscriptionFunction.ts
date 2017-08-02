import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import { FunctionType } from '../../types/types'
import { pick } from 'lodash'

interface Props {
  projectId: string
  name: string
  type?: FunctionType
  webhookUrl: string
  webhookHeaders?: string
  inlineCode?: string
  auth0Id?: string
  isActive: boolean
  query: string
}

const mutation = graphql`
  mutation AddServerSideSubscriptionFunctionMutation(
    $input: AddServerSideSubscriptionFunctionInput!
  ) {
    addServerSideSubscriptionFunction(input: $input) {
      function {
        ...FunctionPopup_function
        ...FunctionRow_function
      }
      project {
        id
        functions(first: 1000) {
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

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: pick(input, [
        'projectId',
        'name',
        'isActive',
        'query',
        'type',
        'webhookUrl',
        'inlineCode',
        'auth0Id',
        'webhookHeaders',
      ]),
    },
    configs: [
      {
        type: 'RANGE_ADD',
        parentName: 'project',
        parentID: input.projectId,
        connectionName: 'functions',
        edgeName: 'functionEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ],
  })
}

export default { commit }
