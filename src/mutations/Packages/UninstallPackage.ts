import { graphql } from 'react-relay'
import { makeMutation } from '../../utils/makeMutation'

export interface UninstallPackageInput {
  projectId: string
  name: string
}

const mutation = graphql`
  mutation UninstallPackageMutation($input: UninstallPackageInput!) {
    uninstallPackage(input: $input) {
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

function commit(props: UninstallPackageInput) {
  return makeMutation({
    mutation,
    variables: props,
    configs: [{
      type: 'REQUIRED_CHILDREN',
      children: [
        graphql`
          fragment UninstallPackageChildren on UninstallPackagePayload {
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
    }],
  })
}

export default { commit }
