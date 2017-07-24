import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import {pick} from 'lodash'

interface Props {
  id: string
  isEnabled: boolean
  apiKey: string
  applicationId: string
  projectId: string
}

const mutation = graphql`
  mutation UpdateSearchProviderAlgolia($input: UpdateSearchProviderAlgoliaInput!) {
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

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: pick(props, ['isEnabled', 'apiKey', 'applicationId', 'projectId']),
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        searchProviderAlgolia: props.id,
      },
    }],
  })
}

export default { commit }
