import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

export interface MigrateProjectInput {
  newSchema: string
  isDryRun: boolean
  force: boolean
}

const mutation = graphql`
  mutation MigrateProjectMutation($input: MigrateProjectInput!) {
    migrateProject(input: $input) {
      errors {
        description
        field
        type
      }
      migrationMessages {
        name
        type
        action
        description
        subDescriptions {
          action
          description
          name
          type
        }
      }
      project {
        schema
      }
    }
  }
`

function commit(props: MigrateProjectInput) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [],
  })
}

export default { commit }
