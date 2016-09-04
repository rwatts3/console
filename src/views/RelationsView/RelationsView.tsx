import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import Header from '../../components/Header/Header'
import {Project, Viewer, Relation} from '../../types/types'
import ScrollBox from '../../components/ScrollBox/ScrollBox'
import RelationRow from './RelationRow'
import {Link} from 'react-router'
import Icon from '../../components/Icon/Icon'
const classes: any = require('./RelationsView.scss')

interface Props {
  viewer: Viewer & { project: Project }
  params: string
  children: Element
  relay: any
}

interface State {
  showAddPopup: boolean
  isCreate: boolean
  selectedRelation: Relation
}

class RelationsView extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      showAddPopup: false,
      isCreate: null,
      selectedRelation: null,
    }
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
          {this.props.children}
          <ScrollBox>
            {this.props.viewer.project.relations.edges.map((edge) => edge.node).map((relation) => (
              <div key={relation.id}>
                <RelationRow
                  relation={relation}
                  project={this.props.viewer.project}
                  onClick={() => {
                    this.setState({
                      showAddPopup: true,
                      isCreate: false,
                      selectedRelation: relation,
                    })
                  }}
                  onRelationDeleted={() => this.props.relay.forceFetch() /* force due to too complicated config*/}
                />
              </div>
            ))}
          </ScrollBox>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(RelationsView, {
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
