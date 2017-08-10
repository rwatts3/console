import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'
import { omit } from 'lodash'

export interface MigrateProjectInput {
  newSchema: string
  isDryRun: boolean
  force: boolean
  projectId: string
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
        typeSchema
        enumSchema
        version
        enums(first: 1000) {
          edges {
            node {
              id
              name
              values
            }
          }
        }
        models(first: 1000) {
          edges {
            node {
              ...NewRow_model
              ...ModelHeader_model
              ...SideNav_model
              ...TypeBox_model
            }
          }
        }
        relations(first: 1000) {
          edges {
            node {
              id
              name
              description
              fieldOnLeftModel {
                id
                name
                isList
                isRequired
              }
              fieldOnRightModel {
                id
                name
                isList
                isRequired
              }
              leftModel {
                id
                name
                namePlural
                itemCount
              }
              rightModel {
                id
                name
                namePlural
                itemCount
              }
            }
          }
        }
      }
    }
  }
`

function commit(input: MigrateProjectInput) {
  return makeMutation({
    mutation,
    variables: { input: omit(input, ['projectId']) },
    configs: [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          project: input.projectId,
        },
      },
    ],
  })
}

export default { commit }
