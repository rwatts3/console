import * as React from 'react'
import * as Relay from 'react-relay'
import Header from '../../components/Header/Header'
import {Project, Viewer, Relation} from '../../types/types'
import ScrollBox from '../../components/ScrollBox/ScrollBox'
import RelationRow from './RelationRow'
import RelationPopup from './RelationPopup'
const classes: any = require('./RelationsView.scss')

interface Props {
  viewer: Viewer & { project: Project }
  params: string
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
        <Header
          viewer={this.props.viewer}
          params={this.props.params}
          project={this.props.viewer.project}
        >
          <div onClick={() => this.setState({ showAddPopup: true, isCreate: true } as State)}
               className={classes.header}>+ Add Relation
          </div>
        </Header>
        <div className={classes.content}>
          <ScrollBox>
            {this.state.showAddPopup &&
            <RelationPopup
              onCancel={() => this.setState({showAddPopup: false, isCreate: null, selectedRelation: null} as State)}
              models={this.props.viewer.project.models.edges.map((edge) => edge.node)}
              projectId={this.props.viewer.project.id}
              relation={this.state.selectedRelation}
              create={this.state.isCreate}
            />
            }
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
