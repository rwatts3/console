import * as React from 'react'
import * as Relay from 'react-relay'
import Popup from '../../components/Popup/Popup'
import Icon from '../../components/Icon/Icon'
import RelationSelector from './RelationSelector'
import RelationExplanation from '../../components/RelationExplanation/RelationExplanation'
import AddRelationMutation from '../../mutations/AddRelationMutation'
import {validateModelName, validateFieldName} from '../../utils/nameValidator'
import {classnames} from '../../utils/classnames'
import UpdateRelationMutation from '../../mutations/UpdateRelationMutation'
import {ShowNotificationCallback} from '../../types/utils'
import {onFailureShowNotification} from '../../utils/relay'
import Help from '../../components/Help/Help'
import {Transaction} from 'react-relay'

const classes: any = require('./RelationPopup.scss')

interface Props {
  location: any
  viewer: any
  relay: any
}

interface State {
  name: string
  description: string
  fieldOnLeftModelName: string
  fieldOnRightModelName: string
  fieldOnLeftModelIsList: boolean
  fieldOnRightModelIsList: boolean
  leftModelId: string
  rightModelId: string
  alertHint: boolean
  showExplanation: boolean
}

class RelationPopup extends React.Component<Props, State> {

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    showNotification: ShowNotificationCallback
    router: any
  }

  refs: {
    [key: string]: any;
    input: HTMLInputElement
  }

  constructor(props: Props) {
    super(props)

    const {relation} = this.props.viewer
    this.state = relation ? this.getExistingRelationState() : this.getNewRelationState()
  }

  render(): JSX.Element {
    return (
      <Popup onClickOutside={this.close} height={'100%'}>
        <div className={classes.root}>
          <div className={classnames(classes.header, classes.name)}>
            New Relation
          </div>
          <div className={classes.container}>
            <div className={classes.content}>
              <div className={classes.title}>
                Relation Schema
              </div>
              <div className={classes.settings}>
                <div className={classes.container}>
                  <RelationSelector
                    models={this.props.viewer.project.models.edges.map((edge) => edge.node)}
                    fieldOnLeftModelName={this.state.fieldOnLeftModelName}
                    fieldOnRightModelName={this.state.fieldOnRightModelName}
                    fieldOnLeftModelIsList={this.state.fieldOnLeftModelIsList}
                    fieldOnRightModelIsList={this.state.fieldOnRightModelIsList}
                    leftModelId={this.state.leftModelId}
                    rightModelId={this.state.rightModelId}
                    onFieldOnLeftModelNameChange={(value) => this.setState({fieldOnLeftModelName: value} as State)}
                    onFieldOnRightModelNameChange={(value) => this.setState({fieldOnRightModelName: value} as State)}
                    onFieldOnLeftModelIsListChange={(value) => this.setState({fieldOnLeftModelIsList: value} as State)}
                    onFieldOnRightModelIsListChange={(value) => this.setState({fieldOnRightModelIsList: value} as State)}
                    onLeftModelIdChange={(value) => this.setState({leftModelId: value} as State)}
                    onRightModelIdChange={(value) => this.setState({rightModelId: value} as State)}
                  />
                </div>
              </div>
              <div className={classes.container}>
                <div>
                  Name
                </div>
                <div className={classnames(classes.name, this.state.alertHint ? classes.alert : '')}>
                  <input
                    autoFocus={!this.props.viewer.relation}
                    ref='input'
                    type='text'
                    placeholder='+ Add Relation Name'
                    value={this.state.name}
                    onChange={(e: any) => this.setState(
                      {
                        name: e.target.value,
                        alertHint: !validateModelName(e.target.value) || e.target.value === '',
                      } as State)}
                  />
                  {this.state.alertHint &&
                  <Help
                    size={35}
                    text={'The relation name has to be capitalized.'}
                    placement={'left'}
                  />
                  }
                </div>
                <div className={classes.description}>
                  <input
                    type='text'
                    placeholder='+ Add Description'
                    value={this.state.description}
                    onChange={(e: any) => this.setState({ description: e.target.value } as State)}
                  />
                </div>
              </div>
              {this.state.leftModelId && this.state.rightModelId &&
              <div className={classes.container}>
                <div className={classes.additionalInfo}>
                  <div
                    className={classnames(classes.tabbutton, this.state.showExplanation ? classes.active : '')}
                    onClick={() => this.setState({showExplanation: true} as State)}
                  >
                    <Help
                      size={12}
                      text={'The relation name has to be capitalized.'}
                      placement={'left'}
                    />
                    <div className={classes.tabheader}>
                      Relation Explanation
                    </div>
                  </div>
                  <div
                    className={classnames(classes.tabbutton, !this.state.showExplanation ? classes.active : '')}
                    onClick={() => this.setState({showExplanation: false} as State)}
                  >
                    <Help
                      size={12}
                      text={'The relation name has to be capitalized.'}
                      placement={'left'}
                    />
                    <div className={classes.tabheader}>
                     Generated Mutations
                    </div>
                  </div>
                </div>
                <div>
                  <RelationExplanation
                    fieldOnLeftModelName={this.state.fieldOnLeftModelName}
                    fieldOnRightModelName={this.state.fieldOnRightModelName}
                    fieldOnLeftModelIsList={this.state.fieldOnLeftModelIsList}
                    fieldOnRightModelIsList={this.state.fieldOnRightModelIsList}
                    leftModelId={this.state.leftModelId}
                    rightModelId={this.state.rightModelId}
                    project={this.props.viewer.project}
                  />
                </div>
              </div>
              }
            </div>
            <div className={classes.buttons}>
              <div onClick={this.close}>
                Cancel
              </div>
              <div className={classnames(classes.submit, this.isValid() ? classes.valid : '')} onClick={this.submit}>
                {this.props.viewer.relation ? 'Save' : 'Create'}
              </div>
            </div>
          </div>
        </div>
      </Popup>
    )
  }

  private close = () => {
    this.context.router.goBack()
  }

  private getNewRelationState = (): State => {

    let preselectedModelId = null

    const {leftModelName} = this.props.location.query
    if (leftModelName) {
      preselectedModelId = this.props.viewer.project.models.edges.map((edge) => edge.node)
        .find((node) => node.name === leftModelName).id
    }
    return {
      name: '',
      description: '',
      fieldOnLeftModelName: '',
      fieldOnRightModelName: leftModelName ? leftModelName.toLowerCase() : '',
      fieldOnLeftModelIsList: false,
      fieldOnRightModelIsList: false,
      leftModelId: preselectedModelId,
      rightModelId: null,
      alertHint: false,
      showExplanation: true,
    } as State
  }

  private getExistingRelationState = (): State => {
    const {relation} = this.props.viewer
    return {
      name: relation.name,
      description: relation.description,
      fieldOnLeftModelName: relation.fieldOnLeftModel.name,
      fieldOnRightModelName: relation.fieldOnRightModel.name,
      fieldOnLeftModelIsList: relation.fieldOnLeftModel.isList,
      fieldOnRightModelIsList: relation.fieldOnRightModel.isList,
      leftModelId: relation.leftModel.id,
      rightModelId: relation.rightModel.id,
      alertHint: false,
      showExplanation: true,
    } as State
  }

  private isValid = (): boolean => {
    const {name, fieldOnLeftModelName, fieldOnRightModelName, leftModelId, rightModelId} = this.state

    const nameIsValid = validateModelName(name)
    const fieldNamesAreValid = validateFieldName(fieldOnLeftModelName) && validateFieldName(fieldOnRightModelName)
    const modelsAreSelected = leftModelId !== null && rightModelId !== null

    return nameIsValid && fieldNamesAreValid && modelsAreSelected
  }

  private submit = (): void => {
    if (this.props.viewer.relation) {
      this.update()
    } else {
      this.create()
    }
  }

  private create = (): void => {
    if (!this.isValid()) {
      return
    }

    if (this.props.viewer.project.id === null) {
      return
    }

    Relay.Store.commitUpdate(
      new AddRelationMutation({
        projectId: this.props.viewer.project.id,
        name: this.state.name,
        description: this.state.description === '' ? null : this.state.description,
        leftModelId: this.state.leftModelId,
        rightModelId: this.state.rightModelId,
        fieldOnLeftModelName: this.state.fieldOnLeftModelName,
        fieldOnRightModelName: this.state.fieldOnRightModelName,
        fieldOnLeftModelIsList: this.state.fieldOnLeftModelIsList,
        fieldOnRightModelIsList: this.state.fieldOnRightModelIsList,
      }),
      {
        onSuccess: () => {
          this.close()
        },
        onFailure: (transaction: Transaction) => onFailureShowNotification(transaction, this.context.showNotification),
      }
    )
  }

  private update = (): void => {
    if (!this.isValid()) {
      return
    }

    if (this.props.viewer.relation === null) {
      return
    }

    Relay.Store.commitUpdate(
      new UpdateRelationMutation({
        relationId: this.props.viewer.relation.id,
        name: this.state.name,
        description: this.state.description === '' ? null : this.state.description,
        leftModelId: this.state.leftModelId,
        rightModelId: this.state.rightModelId,
        fieldOnLeftModelName: this.state.fieldOnLeftModelName,
        fieldOnRightModelName: this.state.fieldOnRightModelName,
        fieldOnLeftModelIsList: this.state.fieldOnLeftModelIsList,
        fieldOnRightModelIsList: this.state.fieldOnRightModelIsList,
      }),
      {
        onSuccess: () => {
          // The force fetching because relations are too complicated to selective choose the config
          this.props.relay.forceFetch()
          this.close()
        },
        onFailure: (transaction: Transaction) => onFailureShowNotification(transaction, this.context.showNotification),
      }
    )
  }
}

export default Relay.createContainer(RelationPopup, {
  initialVariables: {
    projectName: null, // injected from router
    relationName: null, // injected from router
    relationExists: false,
  },
  prepareVariables: (prevVariables: any) => (Object.assign({}, prevVariables, {
    relationExists: !!prevVariables.relationName,
  })),
    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
              relation: relationByName(
              projectName: $projectName
              relationName: $relationName
              ) @include(if: $relationExists) {
                id
                name
                description
                fieldOnLeftModel {
                  id
                  name
                  isList
                }
                fieldOnRightModel {
                  id
                  name
                  isList
                }
                leftModel {
                  id
                  name
                }
                rightModel {
                  id
                  name
                }
              }
              project: projectByName(projectName: $projectName) {
                id
                ${RelationExplanation.getFragment('project')}
                models (first: 1000) {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
        `,
    },
})
