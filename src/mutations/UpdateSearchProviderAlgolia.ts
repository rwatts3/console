import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import { pick } from 'lodash'

interface Props {
  id: string
  isEnabled: boolean
  apiKey: string
  applicationId: string
  projectId: string
}

const mutation = graphql`
  mutation UpdateSearchProviderAlgoliaMutation(
    $input: UpdateSearchProviderAlgoliaInput!
  ) {
    updateSearchProviderAlgolia(input: $input) {
      searchProviderAlgolia {
        id
        applicationId
        apiKey
        isEnabled
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: pick(input, ['isEnabled', 'apiKey', 'applicationId', 'projectId']),
    },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          searchProviderAlgolia: input.id,
        },
      },
    ],
  })
}

export default { commit }
