import * as React from 'react'
import * as Relay from 'react-relay'
import {Link} from 'react-router'
import FieldRow from './FieldRow'
import mapProps from '../../../components/MapProps/MapProps'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import Icon from '../../../components/Icon/Icon'
import Tether from '../../../components/Tether/Tether'
import ModelHeader from '../ModelHeader'
import DeleteModelMutation from '../../../mutations/DeleteModelMutation'
import {Field, Model, Viewer, Project} from '../../../types/types'
import {ShowNotificationCallback} from '../../../types/utils'
import {onFailureShowNotification} from '../../../utils/relay'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {isScalar} from '../../../utils/graphql'
import RelationRow from '../../RelationsView/RelationRow'
const {nextStep} = require('../../../reducers/GettingStartedState') as any
const classes: any = require('./StructureView.scss')

interface Props {
  params: any
  possibleRelatedPermissionPaths: Field[][]
  availableUserRoles: string[]
  fields: Field[]
  allModels: Model[]
  project: Project
  model: Model
  gettingStartedState: any
  nextStep: any
  children: Element
  viewer: Viewer
  relay: Relay.RelayProp
}

interface State {
  menuDropdownVisible: boolean
}

class StructureView extends React.Component<Props, State> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    router: any
    showNotification: ShowNotificationCallback
  }

  state = {
    menuDropdownVisible: false,
  }

  componentDidMount() {
    analytics.track('models/structure: viewed', {
      model: this.props.params.modelName,
    })
  }

  _toggleMenuDropdown = () => {
    this.setState({menuDropdownVisible: !this.state.menuDropdownVisible} as State)
  }

  _deleteModel = () => {
    this._toggleMenuDropdown()

    if (window.confirm('Do you really want to delete this model?')) {
      this.context.router.replace(`/${this.props.params.projectName}/models`)

      Relay.Store.commitUpdate(
        new DeleteModelMutation({
          projectId: this.props.project.id,
          modelId: this.props.model.id,
        }),
        {
          onSuccess: () => {
            analytics.track('models/structure: deleted model', {
              project: this.props.params.projectName,
              model: this.props.params.modelName,
            })
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.context.showNotification)
          },
        }
      )
    }
  }

  render() {

    const scalars = this.props.fields.filter((field) => isScalar(field.typeIdentifier))
    const relations = this.props.fields.filter((field) => !isScalar(field.typeIdentifier))

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
            steps={{
              STEP3_CREATE_TEXT_FIELD: 'Add a new field called "text" and select type "String".' +
              ' Then click the "Create Field" button.',
              STEP4_CREATE_COMPLETED_FIELD: 'Good job! Create another one called "complete" with type "Boolean"',
            }}
            offsetX={5}
            offsetY={5}
            width={240}
          >
            <Link
              className={`${classes.button} ${classes.green}`}
              to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/structure/create`}
            >
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/add.svg')}
              />
              <span>Create Field</span>
            </Link>
          </Tether>
          {!this.props.model.isSystem &&
          <div className={classes.button} onClick={this._toggleMenuDropdown}>
            <Icon
              width={16}
              height={16}
              src={require('assets/icons/more.svg')}
            />
          </div>}
          {this.state.menuDropdownVisible &&
          <div className={classes.menuDropdown}>
            <div onClick={this._deleteModel}>
              Delete Model
            </div>
          </div>
          }
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
                    to={`/${this.props.params.projectName}/relations/create`}
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
    gettingStartedState: state.gettingStartedState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({nextStep}, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StructureView)

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
                    availableUserRoles
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
