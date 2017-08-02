import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import {} from '../types/gettingStarted'

interface Props {
  customerInformationId: string
  name?: string
  email?: string
}

const mutation = graphql`
  mutation UpdateCustomerInformationMutation($input: CrmCustomerInformationInput!) {
    updateCrmCustomerInformation(input: $input) {
      customerInformation {
        id
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        name: input.name,
        email: input.email,
      },
    },
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        customerInformation: input.customerInformationId,
      },
    }],
  })
}

export default { commit }
