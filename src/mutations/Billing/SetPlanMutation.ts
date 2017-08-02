import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  projectId: string
  plan: string
}

const mutation = graphql`
  mutation SetPlanMutation($input: SetPlanInput!) {
    setPlan(input: $input) {
      viewer {
        user {
          crm {
            customer {
              projects(first: 1000) {
                edges {
                  node {
                    projectBillingInformation {
                      plan
                    }
                  }
                }
              }
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
    variables: {input},
    configs: [],
  })
}

export default { commit }
