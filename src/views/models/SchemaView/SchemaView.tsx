import * as React from 'react'
import * as Relay from 'react-relay'
import {Link, withRouter} from 'react-router'
import FieldRow from './FieldRow'
import mapProps from '../../../components/MapProps/MapProps'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import Tether from '../../../components/Tether/Tether'
import ModelHeader from '../ModelHeader'
import {Field, Model, Viewer, Project} from '../../../types/types'
import {GettingStartedState} from '../../../types/gettingStarted'
import {ShowNotificationCallback} from '../../../types/utils'
import {showNotification} from '../../../actions/notification'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep} from '../../../actions/gettingStarted'
const classes: any = require('./SchemaView.scss')
import * as cx from 'classnames'
import {Icon, $p, $v} from 'graphcool-styles'
import {isScalar} from '../../../utils/graphql'
import {ConsoleEvents} from 'graphcool-metrics'
import tracker from '../../../utils/metrics'
import {FieldPopupSource} from 'graphcool-metrics/dist'
import {setFieldPopupSource, setRelationsPopupSource} from '../../../actions/popupSources'
import {RelationsPopupSource} from 'graphcool-metrics/dist/events/Console'

interface Props {
  params: any
  availableUserRoles: string[]
  fields: Field[]
  allModels: Model[]
  project: Project
  model: Model
  gettingStartedState: GettingStartedState
  nextStep: () => any
  router: ReactRouter.InjectedRouter
  route: any
  viewer: Viewer
  relay: Relay.RelayProp
  showNotification: ShowNotificationCallback
  setFieldPopupSource: (source: FieldPopupSource) => void
  setRelationsPopupSource: (source: RelationsPopupSource) => void
}
interface State {
  activeFields: SelectedFieldsType
}

export type SelectedFieldsType = 'All' | 'Scalar' | 'Relations'

class SchemaView extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      activeFields: 'All',
    }
  }

  componentDidMount() {
    tracker.track(ConsoleEvents.Schema.viewed())
  }

  render() {
    const {activeFields} = this.state
    const fields = this.props.fields.filter(field => {
      switch (activeFields) {
        case 'All':
          return true
        case 'Scalar':
          return isScalar(field.typeIdentifier)
        case 'Relations':
          return !isScalar(field.typeIdentifier)
      }
    })
    const urlPrefix = `/${this.props.params.projectName}`
    return (
      <div className={classes.root}>
        {this.props.children}
        <ModelHeader
          buttonsClass={cx(
            $p.ml0,
            $p.mt6,
          )}
          params={this.props.params}
          model={this.props.model}
          viewer={this.props.viewer}
          project={this.props.project}
          forceFetchRoot={this.props.relay.forceFetch}
        >
          <Tether
            steps={[{
              step: 'STEP2_CLICK_CREATE_FIELD_IMAGEURL',
              title: 'Create a field for the image URL',
            }, {
              step: 'STEP2_CREATE_FIELD_DESCRIPTION',
              title: 'Good job!',
              description: 'Create another field called "description" which is of type "String"',
            }]}
            offsetX={5}
            offsetY={5}
            width={240}
            horizontal='right'
            zIndex={2}
          >
            <Link
              className={cx(classes.button, classes.green, $p.buttonShadow)}
              onClick={this.handleCreateFieldClick}
              to={`${urlPrefix}/models/${this.props.params.modelName}/schema/create`}
            >
              <Icon
                width={16}
                height={16}
                src={require('graphcool-styles/icons/stroke/addFull.svg')}
                stroke={true}
                strokeWidth={3}
                color={$v.accent}
              />
              <span>New Field</span>
            </Link>
          </Tether>
          <Link
            className={cx(classes.button, classes.yellow, $p.buttonShadow)}
            onClick={() => this.props.setRelationsPopupSource('schema')}
            to={`${urlPrefix}/relations/create?leftModelName=${this.props.params.modelName}`}
          >
            <Icon
              width={16}
              height={16}
              src={require('graphcool-styles/icons/stroke/addFull.svg')}
              color={$v.lightBrown}
              stroke={true}
              strokeWidth={3}
            />
            <span>New Relation</span>
          </Link>
          <div className={cx(classes.group, $p.buttonShadow)}>
            <Link
              className={cx(
                classes.group_button,
                {
                  [classes.selected]: this.state.activeFields === 'All',
                },
              )}
              onClick={() => this.handleFilterClick('All')}
            >All
            </Link>
            <Link
              className={cx(
                classes.group_button,
                {
                  [classes.selected]: this.state.activeFields === 'Scalar',
                },
              )}
              onClick={() => this.handleFilterClick('Scalar')}
            >Scalar
            </Link>
            <Link
              className={cx(
                classes.group_button,
                {
                  [classes.selected]: this.state.activeFields === 'Relations',
                },
              )}
              onClick={() => this.handleFilterClick('Relations')}
            >Relations</Link>
          </div>
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
              {fields.map((field) => (
                <FieldRow
                  route={this.props.route}
                  key={field.id}
                  field={field}
                  projectId={this.props.project.id}
                  params={this.props.params}
                  model={this.props.model}
                  allModels={this.props.allModels}
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
    this.props.setFieldPopupSource('schema')
    if (this.props.gettingStartedState.isCurrentStep('STEP2_CLICK_CREATE_FIELD_IMAGEURL')) {
      this.props.nextStep()
    }
  }

  private handleFilterClick = (filter: SelectedFieldsType) => {
    tracker.track(ConsoleEvents.Schema.Field.Filter.applied({type: filter as string}))
    this.setState({activeFields: filter})
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
  return bindActionCreators({nextStep, showNotification, setFieldPopupSource, setRelationsPopupSource}, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(SchemaView))

const MappedSchemaView = mapProps({
  relay: (props) => props.relay,
  viewer: (props) => props.viewer,
  params: (props) => props.params,
  availableUserRoles: (props) => props.viewer.project.availableUserRoles,
  allModels: (props) => props.viewer.project.models.edges.map((edge) => edge.node),
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      .sort((a, b) => customCompare(a.name, b.name))
  ),
  model: (props) => props.viewer.model,
  project: (props) => props.viewer.project,
})(ReduxContainer)

export default Relay.createContainer(MappedSchemaView, {
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
