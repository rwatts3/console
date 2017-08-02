import * as React from 'react'
import { createFragmentContainer, graphql, RelayProp } from 'react-relay'
import { $p } from 'graphcool-styles'
import * as cx from 'classnames'
import { QueryEditor } from 'graphiql/dist/components/QueryEditor'
import { Model, SearchProviderAlgolia } from '../../../../types/types'
import { buildClientSchema } from 'graphql'
import { validate } from 'graphql/validation'
import { parse } from 'graphql/language'

interface Props {
  algolia: SearchProviderAlgolia
  fragment: string
  onFragmentChange: (fragment: string, valid: boolean) => void
  relay: RelayProp
  selectedModel: Model
}

interface State {
  schema: any
}

function extractSchema({
  schemaString,
  query,
}): { schema: any; valid: boolean } {
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

export class AlgoliaIndexPopupQuery extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    const { schema } = extractSchema({
      schemaString: props.algolia.algoliaSchema,
      query: props.fragment,
    })

    this.state = {
      schema,
    }
  }
  componentDidMount() {
    const { relay, selectedModel } = this.props
    relay.forceFetch({
      selectedModelId: selectedModel.id,
      modelIdExists: true,
    })
  }
  componentWillReceiveProps(nextProps) {
    const { relay } = this.props
    if (nextProps.selectedModel !== this.props.selectedModel) {
      relay.forceFetch({
        selectedModelId: nextProps.selectedModel.id,
        modelIdExists: true,
      })
    }

    if (nextProps.algolia.algoliaSchema !== this.props.algolia.algoliaSchema) {
      const { algolia, fragment } = nextProps
      const { schema, valid } = extractSchema({
        schemaString: algolia.algoliaSchema,
        query: fragment,
      })
      this.setState({ schema })
    }
  }
  render() {
    const { fragment, onFragmentChange } = this.props
    const { schema } = this.state
    return (
      <div className={cx($p.bgDarkerBlue, $p.w50, $p.pb38, 'root')}>
        <style jsx>{`
          .root {
            @inherit: .overflowScroll;
            max-height: calc(100vh - 100px);
          }
        `}</style>
        <QueryEditor
          schema={schema}
          value={fragment}
          onEdit={this.handleEdit}
        />
      </div>
    )
  }

  private handleEdit = (fragment: string) => {
    const { algolia } = this.props

    const { schema, valid } = extractSchema({
      schemaString: algolia.algoliaSchema,
      query: fragment,
    })

    this.props.onFragmentChange(fragment, valid)
  }
}

export default createFragmentContainer(AlgoliaIndexPopupQuery, {
  algolia: graphql`
    fragment AlgoliaIndexPopupQuery_algolia on SearchProviderAlgolia {
      algoliaSchema(modelId: $selectedModelId) @include(if: $modelIdExists)
    }
  `,
})
