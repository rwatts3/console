import * as React from 'react'
import * as Relay from 'react-relay'
import { Link } from 'react-router'
import FieldRow from './FieldRow'
import ModelDescription from '../ModelDescription'
import mapProps from '../../../components/MapProps/MapProps'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import Icon from '../../../components/Icon/Icon'
import Tether from '../../../components/Tether/Tether'
import DeleteModelMutation from '../../../mutations/DeleteModelMutation'
import { Field, Model } from '../../../types/types'
import { ShowNotificationCallback } from '../../../types/utils'
import { onFailureShowNotification } from '../../../utils/relay'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
const { nextStep } = require('../../../reducers/GettingStartedState') as any
const classes: any = require('./StructureView.scss')

interface Props {
  params: any
  possibleRelatedPermissionPaths: Field[][]
  availableUserRoles: string[]
  fields: Field[]
  allModels: Model[]
  projectId: string
  model: Model
  gettingStartedState: any
  nextStep: any
  children: Element
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

  componentDidMount () {
    analytics.track('models/structure: viewed', {
      model: this.props.params.modelName,
    })
  }

  _toggleMenuDropdown = () => {
    this.setState({ menuDropdownVisible: !this.state.menuDropdownVisible } as State)
  }

  _deleteModel = () => {
    this._toggleMenuDropdown()

    if (window.confirm('Do you really want to delete this model?')) {
      this.context.router.replace(`/${this.props.params.projectName}/models`)

      Relay.Store.commitUpdate(
        new DeleteModelMutation({
          projectId: this.props.projectId,
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

  render () {
    const dataViewOnClick = () => {
      if (this.props.gettingStartedState.isCurrentStep('STEP5_GOTO_DATA_TAB')) {
        this.props.nextStep()
      }
    }

    return (
      <div className={classes.root}>
        {this.props.children}
        <div className={classes.head}>
          <div className={classes.headLeft}>
            <Tether
              steps={{
                STEP5_GOTO_DATA_TAB: 'Nice, you\'re done setting up the structure. Let\'s add some data.',
              }}
              width={200}
              offsetX={-5}
              offsetY={5}
            >
              <Link
                to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/browser`}
                className={classes.tab}
                onClick={dataViewOnClick}
              >
                Data Browser
              </Link>
            </Tether>
            <Link
              to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/structure`}
              className={`${classes.tab} ${classes.active}`}
            >
              Structure
            </Link>
            <div className={classes.info}>
              <div className={classes.title}>
                {this.props.model.name}
                {this.props.model.isSystem &&
                  <span className={classes.system}>System</span>
                }
                <span className={classes.itemCount}>{this.props.model.itemCount} items</span>
              </div>
              <div className={classes.titleDescription}>
                <ModelDescription model={this.props.model} />
              </div>
            </div>
          </div>
          <div className={classes.headRight}>
            <Tether
              steps={{
                STEP3_CREATE_TEXT_FIELD: 'Add a new field called "text" and select type "String".' +
                ' Then click the "Create Field" button.',
                STEP4_CREATE_COMPLETED_FIELD: 'Good job! Create another one called "complete" with type "Boolean"',
              }}
              offsetX={-5}
              offsetY={5}
              width={320}
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
            <div className={classes.button} onClick={this._toggleMenuDropdown}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/more.svg')}
              />
            </div>
            {this.state.menuDropdownVisible &&
              <div className={classes.menuDropdown}>
                <div onClick={this._deleteModel}>
                  Delete Model
                </div>
              </div>
            }
          </div>
        </div>
        <div className={classes.table}>
          <div className={classes.tableHead}>
            <div className={classes.fieldName}>Fieldname</div>
            <div className={classes.type}>Type</div>
            <div className={classes.description}>Description</div>
            <div className={classes.constraints}>Constraints</div>
            <div className={classes.permissions}>Permissions</div>
            <div className={classes.controls} />
          </div>
          <div className={classes.tableBody}>
            <ScrollBox>
              {this.props.fields.map((field) => (
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

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ nextStep }, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StructureView)

const MappedStructureView = mapProps({
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
  projectId: (props) => props.viewer.project.id,
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
          name
          itemCount
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
                ${FieldRow.getFragment('field')}
              }
            }
          }
          ${ModelDescription.getFragment('model')}
        }
        project: projectByName(projectName: $projectName) {
          id
          availableUserRoles
          models(first: 100) {
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
        }
      }
    `,
  },
})
