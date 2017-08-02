import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

export interface InstallPackageInput {
  projectId: string
  definition: string
}

const mutation = graphql`
  mutation InstallPackageMutation($input: InstallPackageInput!) {
    installPackage(input: $input) {
      project {
        schema
        packageDefinitions(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`

function commit(input: InstallPackageInput) {
  return makeMutation({
    mutation,
    variables: { input },
    configs: [
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          graphql`
            fragment InstallPackageChildren on InstallPackagePayload {
              project {
                schema
                packageDefinitions(first: 100) {
                  edges {
                    node {
                      id
                      definition
                      name
                    }
                  }
                }
              }
            }
          `,
        ],
      },
    ],
  })
}

export default { commit }
