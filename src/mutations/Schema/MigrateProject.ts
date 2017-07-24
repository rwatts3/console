import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

export interface MigrateProjectInput {
  newSchema: string
  isDryRun: boolean
  force: boolean
}

const mutation = graphql`
  mutation MigrateProject($input: MigrateProjectMutation!) {
    migrateProject(input: $input) {
      migrationMessages
      errors
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
    configs: [{
      type: 'REQUIRED_CHILDREN',
      children: [
        graphql`
          fragment MigrateProjectChildren on MigrateProjectPayload {
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
        `,
      ],
    }],
  })
}

export default { commit }
