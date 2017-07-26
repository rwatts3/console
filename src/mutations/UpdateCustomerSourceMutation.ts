import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import {} from '../types/gettingStarted'

interface Props {
  customerInformationId: string
  source: string
  referral: string
}

const mutation = graphql`
  mutation UpdateCustomerSourceMutation($input: CrmCustomerInformationInput!) {
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
        source: input.source,
        referral: input.referral,
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
