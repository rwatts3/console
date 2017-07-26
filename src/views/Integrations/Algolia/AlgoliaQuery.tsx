import * as React from 'react'
import {
  createRefetchContainer,
  graphql,
  RelayProp,
} from 'react-relay'
import {QueryEditor} from 'graphiql/dist/components/QueryEditor'
import {Model, SearchProviderAlgolia} from '../../../types/types'
import {withRouter} from 'found'
import { buildClientSchema } from 'graphql'
import { validate } from 'graphql/validation'
import { parse } from 'graphql/language'

interface Props {
  algolia: SearchProviderAlgolia
  fragment: string
  onFragmentChange: (fragment: String, valid: boolean) => void
  relay: RelayProp
  selectedModel: Model
}

interface State {
  schema: any
}

function extractSchema ({ schemaString, query }): { schema: any, valid: boolean } {
  const schema = schemaString
    ? buildClientSchema(JSON.parse(schemaString))
    : null

  let valid = false
  if (schema && query) {
    try {
      valid = validate(schema, parse(query)).length === 0
    } catch (err) {
      // ignore
    }
  }

  return { schema, valid }
}

class AlgoliaQuery extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    const { schema, valid } = extractSchema({
      schemaString: props.algolia.algoliaSchema,
      query: props.fragment,
    })

    this.state = {
      schema,
    }
  }
  componentDidMount() {
    const {relay, selectedModel} = this.props
    relay.refetch(
      fragmentVariables => ({
        ...fragmentVariables,
        selectedModelId: selectedModel.id,
        modelIdExists: true,
      }),
    )
  }
  componentWillReceiveProps(nextProps) {
    const {relay} = this.props
    if (nextProps.selectedModel !== this.props.selectedModel) {
      relay.refetch(
        fragmentVariables => ({
          ...fragmentVariables,
          selectedModelId: nextProps.selectedModel.id,
          modelIdExists: true,
        }),
      )
    }

    if (nextProps.algolia.algoliaSchema !== this.props.algolia.algoliaSchema) {
      const {algolia, fragment} = nextProps
      const { schema, valid } = extractSchema({
        schemaString: algolia.algoliaSchema,
        query: fragment,
      })
      this.setState({schema})
    }
  }
  render() {
    const {fragment, onFragmentChange} = this.props
    const {schema} = this.state
    return (
      <QueryEditor
        schema={schema}
        value={fragment}
        onEdit={this.handleEdit}
      />
    )
  }

  private handleEdit = (fragment: string) => {
    const {algolia} = this.props

    const { schema, valid } = extractSchema({
      schemaString: algolia.algoliaSchema,
      query: fragment,
    })

    this.props.onFragmentChange(fragment, valid)
  }
}

export default createRefetchContainer(
  AlgoliaQuery,
  {
    /* TODO manually deal with:
    initialVariables: {
      // selectedModelId: 'ciwtmzbd600pk019041qz8b7g',
      // modelIdExists: true,
      selectedModelId: null,
      modelIdExists: false,
    }
    */
    algolia: graphql.experimental`
      fragment AlgoliaQuery_algolia on SearchProviderAlgolia
      @argumentDefinitions(
        selectedModelId: {type: "ID!", defaultValue: ""}
        modelIdExists: {type: "Boolean!", defaultValue: false}
      ) {
        algoliaSchema(modelId: $selectedModelId) @include(if: $modelIdExists)
      }
    `,
  },
  graphql.experimental`
    query AlgoliaQueryRefetchQuery($selectedModelId: ID!, $modelIdExists: Boolean!, $projectName: String!) {
      viewer {
        projectByName(projectName: $projectName) {
          id
          integrations(first: 1000) {
            edges {
              node {
                id
                name
                type
                ... on SearchProviderAlgolia {
                  ...AlgoliaQuery_algolia @arguments(selectedModelId: $selectedModelId, modelIdExists: $modelIdExists)
                }
              }
            }
          }
        }
      }
    }
  `,
)
