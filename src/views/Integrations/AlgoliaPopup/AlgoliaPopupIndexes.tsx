import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { $p } from 'graphcool-styles'
import * as cx from 'classnames'
import styled from 'styled-components'
import { Viewer, SearchProviderAlgolia } from '../../../types/types'
import PopupWrapper from '../../../components/PopupWrapper/PopupWrapper'
import { withRouter } from 'found'
import AlgoliaPopupIndexTop from './AlgoliaPopupIndexTop'
import AlgoliaPopupIndex from './AlgoliaPopupIndex'
import mapProps from '../../../components/MapProps/MapProps'

interface Props {
  viewer: Viewer
  params: any
  router: ReactRouter.InjectedRouter
  algolia: SearchProviderAlgolia
}

class AlgoliaPopupIndexes extends React.Component<Props, {}> {
  render() {
    const { algolia, params } = this.props
    return (
      <div>
        <AlgoliaPopupIndexTop params={params} />
        {algolia &&
          algolia.algoliaSyncQueries &&
          algolia.algoliaSyncQueries.edges
            .map(edge => edge.node)
            .map(index =>
              <AlgoliaPopupIndex
                params={params}
                key={index.id}
                index={index}
                algolia={algolia}
              />,
            )}
      </div>
    )
  }
}

export default createFragmentContainer(withRouter(AlgoliaPopupIndexes), {
  algolia: graphql`
    fragment AlgoliaPopupIndexes_algolia on SearchProviderAlgolia {
      ...AlgoliaPopupIndex_algolia
      algoliaSyncQueries(first: 1000) {
        edges {
          node {
            id
            ...AlgoliaPopupIndex_index
          }
        }
      }
    }
  `,
})
