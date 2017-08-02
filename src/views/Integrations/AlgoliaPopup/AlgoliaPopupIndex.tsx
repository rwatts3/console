import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { $p } from 'graphcool-styles'
import * as cx from 'classnames'
import {
  SearchProviderAlgolia,
  AlgoliaSyncQuery,
} from '../../../types/types'
import { withRouter } from 'found'
import { Link } from 'found'
import UpdateAlgoliaSyncQueryMutation from '../../../mutations/UpdateAlgoliaSyncQueryMutation'
import NewToggleButton from '../../../components/NewToggleButton/NewToggleButton'
import GraphQLCode from '../../../components/GraphQLCode/GraphQLCode'

interface Props {
  index: AlgoliaSyncQuery
  algolia: SearchProviderAlgolia
  params: any
}

class AlgoliaPopupIndexes extends React.Component<Props, {}> {
  render() {
    const {
      params,
      index: { indexName, fragment, isEnabled, model, id },
    } = this.props
    return (
      <div className={cx($p.flex, $p.flexRow)}>
        <div className={cx($p.ph38, $p.w50, $p.relative)}>
          <Link
            className={cx(
              $p.black,
              $p.fw3,
              $p.f25,
              $p.mt10,
              $p.pointer,
              $p.db,
              $p.pr16,
            )}
            to={`/${params.projectName}/integrations/algolia/edit/${id}`}
          >
            {indexName}
          </Link>
          <div
            className={cx(
              $p.bgBlack10,
              $p.f16,
              $p.pv0,
              $p.ph6,
              $p.mt16,
              $p.dib,
            )}
          >
            {model.name}
          </div>
          <div className={cx($p.absolute, $p.top16, $p.right16)}>
            <NewToggleButton
              defaultChecked={isEnabled}
              onChange={this.toggle}
              className={cx($p.mt4)}
            />
          </div>
        </div>
        <Link
          className={cx($p.bgDarkBlue, $p.pa38, $p.w50, $p.pt10)}
          to={`/${params.projectName}/integrations/algolia/edit/${id}`}
        >
          <GraphQLCode code={fragment} />
        </Link>
      </div>
    )
  }

  toggle = e => {
    const { index: { id, fragment, indexName, isEnabled } } = this.props

    UpdateAlgoliaSyncQueryMutation.commit({
      algoliaSyncQueryId: id,
      indexName,
      fragment,
      isEnabled: !isEnabled,
    })
  }
}

export default createFragmentContainer(withRouter(AlgoliaPopupIndexes), {
  algolia: graphql`
    fragment AlgoliaPopupIndex_algolia on SearchProviderAlgolia {
      ...AlgoliaIndexPopupQuery_algolia
    }
  `,
  index: graphql`
    fragment AlgoliaPopupIndex_index on AlgoliaSyncQuery {
      id
      fragment
      indexName
      isEnabled
      model {
        id
        name
      }
    }
  `,
})
