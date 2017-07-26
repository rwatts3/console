import * as Relay from 'react-relay/classic'
import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

interface Props {
  projectId: string
}

const mutation = graphql`
  mutation DeleteCreditCardMutation($input: DeleteCreditCardInput!) {
    deleteCreditCard(input: $input) {
      user {
        name
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {input},
    configs: [], // TODO look into this, a mutation without effects doesn't make sense
  })
}

export default { commit }
