import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import { Step } from '../types/gettingStarted'
import { Example } from '../types/types'

interface Props {
  onboardingStatusId: string
  gettingStarted: Step
  gettingStartedSkipped: boolean
  gettingStartedCompleted: boolean
  gettingStartedExample: Example
}

const mutation = graphql`
  mutation UpdateCustomerOnboardingStatusMutation(
    $input: CrmOnboardingStatusInput!
  ) {
    updateCrmOnboardingStatus(input: $input) {
      onboardingStatus {
        id
        gettingStarted
        gettingStartedExample
        gettingStartedSkipped
        gettingStartedCompleted
      }
    }
  }
`

function commit(input: Props) {
  return makeMutation({
    mutation,
    variables: {
      input: {
        gettingStarted: input.gettingStarted,
        gettingStartedSkipped: input.gettingStartedSkipped,
        gettingStartedCompleted: input.gettingStartedCompleted,
        gettingStartedExample: input.gettingStartedExample,
      },
    },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          onboardingStatus: input.onboardingStatusId,
        },
      },
    ],
  })
}

export default { commit }
