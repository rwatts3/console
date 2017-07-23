import { graphql } from 'react-relay'
import { makeMutation } from '../utils/makeMutation'
import {Step} from '../types/gettingStarted'
import {Example} from '../types/types'

interface Props {
  onboardingStatusId: string
  gettingStarted: Step
  gettingStartedSkipped: boolean
  gettingStartedCompleted: boolean
  gettingStartedExample: Example
}

const mutation = graphql`
  mutation UpdateCustomerOnoboardingStatusMutation($input: UpdateCrmOnboardingStatusInput!) {
    updateCrmOnboardingStatus(input: $input) {
      onboardingStatus {
        id
        gettingStarted
        gettingStartedExample
        systemBridge {
          id
        }
        gettingStartedSkipped
        gettingStartedCompleted
      }
    }
  }
`

function commit(props: Props) {
  return makeMutation({
    mutation,
    variables: {
      gettingStarted: props.gettingStarted,
      gettingStartedSkipped: props.gettingStartedSkipped,
      gettingStartedCompleted: props.gettingStartedCompleted,
      gettingStartedExample: props.gettingStartedExample,
    },
    configs: [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        onboardingStatus: props.onboardingStatusId,
      },
    }],
  })
}

export default { commit }
