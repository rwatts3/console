import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  projectId: string
  token: string
}

const mutation = graphql`
  mutation SetCreditCardMutation($input: SetCreditCardInput!) {
    setCreditCard(input: $input) {
      viewer {
        user {
          crm {
            customer {
              projects(first: 1000) {
                edges {
                  node {
                    projectBillingInformation {
                      creditCard {
                        expMonth
                        expYear
                        last4
                        name
                        addressLine1
                        addressLine2
                        addressCity
                        addressZip
                        addressState
                        addressCountry
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
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: { input },
    configs: [],
  })
}

export default { commit }
