import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import {} from '../types/gettingStarted'

interface Props {
  customerInformationId: string
  source: string
  referral: string
}

const mutation = graphql`
  mutation UpdateCustomerSourceMutation($input: UpdateCrmCustomerInformationInput!) {
    updateCrmCustomerInformation(input: $input) {
      customerInformation {
        id
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      source: props.source,
      referral: props.referral,
    },
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        customerInformation: props.customerInformationId,
      },
    }]
  })
}

export default { commit }
