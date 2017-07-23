import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import {} from '../types/gettingStarted'

interface Props {
  customerInformationId: string
  name?: string
  email?: string
}

const mutation = graphql`
  mutation UpdateCustomerInformationMutation($input: UpdateCrmCustomerInformationInput!) {
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
      name: props.name,
      email: props.email,
    },
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        customerInformation: props.customerInformationId,
      },
    }],
  })
}

export default { commit }
