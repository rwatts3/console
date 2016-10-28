import * as React from 'react'
import * as Relay from 'react-relay'
import {Link, withRouter} from 'react-router'
import FieldRow from './FieldRow'
import mapProps from '../../../components/MapProps/MapProps'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import Icon from '../../../components/Icon/Icon'
import Tether from '../../../components/Tether/Tether'
import ModelHeader from '../ModelHeader'
import {Field, Model, Viewer, Project} from '../../../types/types'
import {GettingStartedState} from '../../../types/gettingStarted'
import {ShowNotificationCallback} from '../../../types/utils'
import {showNotification} from '../../../actions/notification'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {isScalar} from '../../../utils/graphql'
import {nextStep} from '../../../actions/gettingStarted'
const classes: any = require('./StructureView.scss')

interface Props {
  params: any
  possibleRelatedPermissionPaths: Field[][]
  availableUserRoles: string[]
  fields: Field[]
  allModels: Model[]
  project: Project
  model: Model
  gettingStartedState: GettingStartedState
  nextStep: () => any
  router: ReactRouter.InjectedRouter
  route: any
  children: Element
  viewer: Viewer
  relay: Relay.RelayProp
  showNotification: ShowNotificationCallback
}

class StructureView extends React.Component<Props, {}> {

  componentDidMount() {
    analytics.track('models/structure: viewed', {
      model: this.props.params.modelName,
    })
  }

  render() {

    const scalars = this.props.fields.filter((field) => isScalar(field.typeIdentifier))
    const relations = this.props.fields.filter((field) => !isScalar(field.typeIdentifier))
    const urlPrefix = `/${this.props.params.projectName}`
    return (
      <div className={classes.root}>
        {this.props.children}
        <ModelHeader
          params={this.props.params}
          model={this.props.model}
          viewer={this.props.viewer}
          project={this.props.project}
        >
          <Tether
            steps={[{
              step: 'STEP2_CLICK_CREATE_FIELD_IMAGEURL',
              title: 'Create a field for the image URL',
            }, {
              step: 'STEP2_CREATE_FIELD_DESCRIPTION',
              title: 'Good job! Create another field called "description" which is of type "String"',
            }]}
            offsetX={5}
            offsetY={5}
            width={240}
            horizontal='right'
            zIndex={2}
          >
            <Link
              className={`${classes.button} ${classes.green}`}
              onClick={this.handleCreateFieldClick}
              to={`${urlPrefix}/models/${this.props.params.modelName}/structure/create`}
            >
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/add.svg')}
              />
              <span>Create Field</span>
            </Link>
          </Tether>
        </ModelHeader>
        <div className={classes.table}>
          <div className={classes.tableHead}>
            <div className={classes.fieldName}>Fieldname</div>
            <div className={classes.type}>Type</div>
            <div className={classes.description}>Description</div>
            <div className={classes.constraints}>Constraints</div>
            <div className={classes.permissions}>Permissions</div>
            <div className={classes.controls}/>
          </div>
          <div className={classes.tableBody}>
            <ScrollBox>
              {scalars.map((field) => (
                <FieldRow
                  route={this.props.route}
                  key={field.id}
                  field={field}
                  params={this.props.params}
                  model={this.props.model}
                  allModels={this.props.allModels}
                  possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
                  availableUserRoles={this.props.availableUserRoles}
                />
              ))}
              <hr/>
              <div className={classes.relationHeader}>
                <div>
                  Relations
                </div>
                <div>
                  <Link
                    className={`${classes.button} ${classes.green}`}
                    to={`${urlPrefix}/relations/create?leftModelName=${this.props.params.modelName}`}
                  >
                    <Icon
                      width={16}
                      height={16}
                      src={require('assets/icons/add.svg')}
                    />
                    <span>Create Relation</span>
                  </Link>
                </div>
              </div>
              {relations.length === 0 &&
                <div className={classes.noRelations}>
                  No Relations
                </div>
              }
              {relations.map((field) => (
                <FieldRow
                  route={this.props.route}
                  key={field.id}
                  field={field}
                  params={this.props.params}
                  model={this.props.model}
                  allModels={this.props.allModels}
                  possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
                  availableUserRoles={this.props.availableUserRoles}
                />
              ))}
            </ScrollBox>
          </div>
        </div>
      </div>
    )
  }

  private handleCreateFieldClick = (e: any) => {
    if (this.props.gettingStartedState.isCurrentStep('STEP2_CLICK_CREATE_FIELD_IMAGEURL')) {
      this.props.nextStep()
    }
  }

}

// id field should always be first
const customCompare = (fieldNameA, fieldNameB) => {
  if (fieldNameA !== 'id' && fieldNameB !== 'id') {
    return fieldNameA.localeCompare(fieldNameB)
  }

  return fieldNameA === 'id' ? -1 : 1
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({nextStep, showNotification}, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(StructureView))

const MappedStructureView = mapProps({
  relay: (props) => props.relay,
  viewer: (props) => props.viewer,
  params: (props) => props.params,
  availableUserRoles: (props) => props.viewer.project.availableUserRoles,
  allModels: (props) => props.viewer.project.models.edges.map((edge) => edge.node),
  possibleRelatedPermissionPaths: (props) => (
    props.viewer.model.possibleRelatedPermissionPaths.edges
      .map((edge) => edge.node.fields)
  ),
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      .sort((a, b) => customCompare(a.name, b.name))
  ),
  model: (props) => props.viewer.model,
  project: (props) => props.viewer.project,
})(ReduxContainer)

export default Relay.createContainer(MappedStructureView, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
  },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                model: modelByName(projectName: $projectName, modelName: $modelName) {
                    id
                    isSystem
                    possibleRelatedPermissionPaths(first: 100) {
                        edges {
                            node {
                                fields {
                                    id
                                    name
                                    typeIdentifier
                                }
                            }
                        }
                    }
                    fields(first: 100) {
                        edges {
                            node {
                                id
                                name
                                typeIdentifier
                                relation {
                                    name
                                }
                                ${FieldRow.getFragment('field')}
                            }
                        }
                    }
                    ${ModelHeader.getFragment('model')}
                }
                project: projectByName(projectName: $projectName) {
                    id
                    name
                    models(first: 1000) {
                        edges {
                            node {
                                id
                                name
                                unconnectedReverseRelationFieldsFrom(relatedModelName: $modelName) {
                                    id
                                    name
                                    relation {
                                        id
                                    }
                                }
                            }
                        }
                    }
                    ${ModelHeader.getFragment('project')}
                }
                ${ModelHeader.getFragment('viewer')}
            }
        `,
    },
})
