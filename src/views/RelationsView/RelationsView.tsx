import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import Header from '../../components/Header/Header'
import {Project, Viewer} from '../../types/types'
import ScrollBox from '../../components/ScrollBox/ScrollBox'
import RelationRow from './RelationRow'
import {Link} from 'react-router'
import {Icon} from 'graphcool-styles'
const classes: any = require('./RelationsView.scss')
import * as cx from 'classnames'
import {$p} from 'graphcool-styles'
import {ConsoleEvents} from 'graphcool-metrics'
import tracker from '../../utils/metrics'
import {RelationsPopupSource} from 'graphcool-metrics/dist/events/Console'
import {setRelationsPopupSource} from '../../actions/popupSources'
import {connect} from 'react-redux'

interface Props {
  viewer: Viewer & { project: Project }
  params: string
  children: Element
  relay: any
  setRelationsPopupSource: (source: RelationsPopupSource) => void
}

class RelationsView extends React.Component<Props, {}> {

  componentDidMount() {
    tracker.track(ConsoleEvents.Relations.viewed())
  }

  render(): JSX.Element {
    return (
      <div className={classes.root}>
        <Helmet title='Relations' />
        <Header
          viewer={this.props.viewer}
          params={this.props.params}
          project={this.props.viewer.project}
        >
          <div className={classes.header}>
            <Link
              className={`${classes.button} ${classes.green}`}
              to={`/${this.props.viewer.project.name}/relations/create`}
              onClick={() => {
                this.props.setRelationsPopupSource('relations')
              }}
            >
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/add.svg')}
              />
              <span>Create Relation</span>
            </Link>
          </div>
        </Header>
        <div className={classes.content}>
          <ScrollBox>
            {this.props.viewer.project.relations.edges.map((edge) => edge.node).map((relation) => (
              <div key={relation.id}>
                <RelationRow
                  relation={relation}
                  project={this.props.viewer.project}
                  onRelationDeleted={() => {
                    this.props.relay.forceFetch()
                    tracker.track(ConsoleEvents.Relations.deleted())
                  } /* force due to too complicated config*/}
                />
              </div>
            ))}
            {this.props.viewer.project.relations.edges.length === 0 && (
              <div className={cx($p.flex, $p.h100, $p.w100, $p.itemsCenter, $p.justifyCenter)}>
                <div
                  className={cx($p.flex, $p.flexColumn, $p.justifyCenter, $p.mb38)}
                >
                  <h2 className={cx($p.fw3, $p.mb16)}>Welcome to our Relations feature</h2>
                  <div className={cx($p.flex, $p.flexRow)}>
                    <div className={cx($p.flexAuto)}>
                      <div className={cx($p.black50)}>
                        Here you can create relations between Models.
                      </div>
                      <div className={$p.black50}>
                        To learn more about relations, please have a look in our docs.
                      </div>
                    </div>
                    <div className={$p.ml10}>
                      <a
                        className={cx(
                          $p.pa16,
                          $p.f16,
                          $p.white,
                          $p.br2,
                          $p.bgGreen,
                          $p.pointer,
                          $p.db,
                        )}
                        href='https://graph.cool/docs/faq/graphcool-relation-multiplicities-chietu0ahn'
                        target='_blank'
                      >
                        Docs
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollBox>
        </div>
        {this.props.children}
      </div>
    )
  }
}

const ConnectedRelationsView = connect(null, { setRelationsPopupSource })(RelationsView)

export default Relay.createContainer(ConnectedRelationsView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
          name
          relations(first: 1000) {
            edges {
              node {
                id
                name
                description
                leftModel {
                  id
                }
                rightModel {
                  id
                }
                fieldOnLeftModel {
                  name
                  isList
                }
                fieldOnRightModel {
                  name
                  isList
                }
                ${RelationRow.getFragment('relation')}
              }
            }
          }
          models(first: 1000) {
            edges {
              node {
                id
                name
                fields(first: 1000) {
                  edges {
                    node {
                      name
                      id
                    }
                  }
                }
              }
            }
          }
          ${Header.getFragment('project')}
        }
        ${Header.getFragment('viewer')}
      }
    `,
  },
})
