import * as React from 'react'
import * as Relay from 'react-relay'
import {Transaction} from 'react-relay'
import {RelationPopupDisplayState, Cardinality, Model, Relation} from '../../types/types'
import CreateRelationHeader from './CreateRelationHeader'
import PopupWrapper from '../../components/PopupWrapper/PopupWrapper'
import {withRouter} from 'react-router'
import CreateRelationFooter from './CreateRelationFooter'
import DefineRelation from './DefineRelation'
import SetMutation from './SetMutation'
import AddRelationMutation from '../../mutations/AddRelationMutation'
import UpdateRelationMutation from '../../mutations/UpdateRelationMutation'
import {lowercaseFirstLetter, removeDuplicatesFromStringArray} from '../../utils/utils'
import BreakingChangeIndicator from './BreakingChangeIndicator'
import DeleteRelationMutation from '../../mutations/DeleteRelationMutation'

interface State {
  displayState: RelationPopupDisplayState
  leftSelectedModel: Model | null
  rightSelectedModel: Model | null
  selectedCardinality: Cardinality
  relationName: string
  relationDescription: string
  fieldOnLeftModelName: string | null
  fieldOnRightModelName: string | null
  leftInputIsBreakingChange: boolean
  rightInputIsBreakingChange: boolean
  relationNameIsBreakingChange: boolean
  leftModelIsBreakingChange: boolean
  rightModelIsBreakingChange: boolean
  cardinalityIsBreakingChange: boolean
  // leftSideMessagesForBreakingChange: string[]
  // rightSideMessagesForBreakingChange: string[]
}

interface Props {
  router: ReactRouter.InjectedRouter
  viewer: any
  relay: Relay.RelayProp
}

class CreateRelationPopup extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    const {relation} = props.viewer

    console.log('relation', relation)

    this.state = {
      displayState: 'DEFINE_RELATION' as RelationPopupDisplayState,
      leftSelectedModel: relation ? relation.leftModel : null,
      rightSelectedModel: relation ? relation.rightModel : null,
      selectedCardinality: relation ?
        this.cardinalityFromRelation(relation) : 'ONE_TO_ONE' as Cardinality,
      relationName: relation ? relation.name : '',
      relationDescription: relation ? relation.description : '',
      fieldOnLeftModelName: relation ? relation.fieldOnLeftModel.name : null,
      fieldOnRightModelName: relation ? relation.fieldOnRightModel.name : null,
      leftInputIsBreakingChange: false,
      rightInputIsBreakingChange: false,
      relationNameIsBreakingChange: false,
      leftModelIsBreakingChange: false,
      rightModelIsBreakingChange: false,
      cardinalityIsBreakingChange: false,
      // leftSideMessagesForBreakingChange: [],
      // rightSideMessagesForBreakingChange: [],
    }
  }

  render() {

    const {relation} = this.props.viewer
    const models = this.props.viewer.project.models.edges.map(edge => edge.node)
    let forbiddenFieldNames = removeDuplicatesFromStringArray(
      this.props.viewer.project.fields.edges.map(edge => edge.node.name)
    )
    console.log('relation.fieldOnLeftModel.name', relation.fieldOnLeftModel.name)
    console.log('relation.fieldOnRightModel.name', relation.fieldOnRightModel.name)

    forbiddenFieldNames = forbiddenFieldNames.filter(fieldName =>
      fieldName !== relation.fieldOnLeftModel.name && fieldName !== relation.fieldOnRightModel.name)

    console.log(forbiddenFieldNames)
    const {displayState, leftSelectedModel, rightSelectedModel,
      selectedCardinality, relationName, relationDescription,
      fieldOnRightModelName, fieldOnLeftModelName, leftModelIsBreakingChange, rightModelIsBreakingChange,
      leftInputIsBreakingChange, rightInputIsBreakingChange, relationNameIsBreakingChange} = this.state

    const displayBreakingIndicator = (Boolean(this.props.viewer.relation)) &&
      (leftInputIsBreakingChange || rightInputIsBreakingChange ||
      relationNameIsBreakingChange || leftModelIsBreakingChange || rightModelIsBreakingChange)

    const breakingChangeMessageElements: JSX.Element[] =
      displayBreakingIndicator && this.breakingChangeMessages().map((message, i) => <div key={i}>{message}</div>)
    const infoMessageElement: JSX.Element[] = [(
      <div>
        <div><b>Breaking Changes:</b></div>
        {breakingChangeMessageElements}
      </div>
    )]

    let leftModelNameForFooter
    if (relation) {
      leftModelNameForFooter = relation.leftModel.name
    } else {
      leftModelNameForFooter = null
    }

    let rightModelNameForFooter
    if (relation) {
      rightModelNameForFooter = relation.rightModel.name
    } else {
      rightModelNameForFooter = null
    }

    let relationNameForFooter = relation && relation.name

    console.log(leftModelNameForFooter, rightModelNameForFooter, relationNameForFooter)

    return (
      <PopupWrapper onClickOutside={this.close}>
        <style global jsx={true}>{`
          .relationPopupContent {
            @inherit: .buttonShadow;
            width: 700px;
          }
        `}</style>
        <div className='flex itemsCenter justifyCenter w100 h100'>
          <BreakingChangeIndicator
            className='relationPopupContent'
            width={35}
            height={21}
            tops={displayBreakingIndicator ? [40] : []}
            plain={displayBreakingIndicator ? [false] : []}
            messages={infoMessageElement}
          >
            <div className='flex flexColumn justifyBetween h100'>
              <div>
                <CreateRelationHeader
                  displayState={displayState}
                  switchDisplayState={this.switchToDisplayState}
                  close={this.close}
                />
                {
                  displayState === 'DEFINE_RELATION' ?
                    <DefineRelation
                      models={models}
                      leftSelectedModel={leftSelectedModel}
                      rightSelectedModel={rightSelectedModel}
                      selectedCardinality={selectedCardinality}
                      didSelectLeftModel={this.didSelectLeftModel}
                      didSelectRightModel={this.didSelectRightModel}
                      didSelectCardinality={this.didSelectCardinality}
                      rightFieldName={fieldOnRightModelName}
                      rightFieldType={this.rightFieldType()}
                      leftFieldName={fieldOnLeftModelName}
                      leftFieldType={this.leftFieldType()}
                      didChangeFieldNameOnLeftModel={this.didChangeFieldNameOnLeftModel}
                      didChangeFieldNameOnRightModel={this.didChangeFieldNameOnRightModel}
                      fieldOnLeftModelName={fieldOnLeftModelName}
                      fieldOnRightModelName={fieldOnRightModelName}
                      leftInputIsBreakingChange={leftInputIsBreakingChange}
                      rightInputIsBreakingChange={rightInputIsBreakingChange}
                      leftModelIsBreakingChange={leftModelIsBreakingChange}
                      rightModelIsBreakingChange={rightModelIsBreakingChange}
                      forbiddenFieldNames={forbiddenFieldNames}
                    />
                    :
                    <SetMutation
                      relationName={relationName}
                      relationDescription={relationDescription}
                      onChangeRelationNameInput={this.onChangeRelationNameInput}
                      onChangeRelationDescriptionInput={this.onChangeRelationDescriptionInput}
                      leftSelectedModel={leftSelectedModel}
                      rightSelectedModel={rightSelectedModel}
                      selectedCardinality={selectedCardinality}
                      fieldOnLeftModelName={fieldOnLeftModelName}
                      fieldOnRightModelName={fieldOnRightModelName}
                      relationNameIsBreakingChange={relationNameIsBreakingChange}
                    />
                }
              </div>
              <CreateRelationFooter
                displayState={displayState}
                switchDisplayState={this.switchToDisplayState}
                onClickCreateRelation={this.addRelation}
                onClickEditRelation={this.editRelation}
                onClickDeleteRelation={this.deleteRelation}
                resetToInitialState={this.resetToInitialState}
                canSubmit={leftSelectedModel && rightSelectedModel && relationName.length > 0}
                isEditingExistingRelation={Boolean(relation)}
                close={this.close}
                leftModelName={leftModelNameForFooter}
                rightModelName={rightModelNameForFooter}
                relationName={relationNameForFooter}
                displayConfirmBreakingChangesPopup={displayBreakingIndicator}
              />
            </div>
          </BreakingChangeIndicator>
        </div>
      </PopupWrapper>
    )
  }

  private close = () => {
    this.props.router.goBack()
  }

  private didChangeFieldNameOnLeftModel = (newFieldName: string) => {
    const {relation} = this.props.viewer

    this.setState({
      fieldOnLeftModelName: newFieldName,
    } as State)
    if (this.props.viewer.relation) {
      this.setState({
        leftInputIsBreakingChange: relation ? newFieldName !== relation.fieldOnLeftModel.name : false,
      } as State)
    }
  }

  private didChangeFieldNameOnRightModel = (newFieldName: string) => {
    const {relation} = this.props.viewer

    this.setState({
      fieldOnRightModelName: newFieldName,
    } as State)
    if (this.props.viewer.relation) {
      this.setState({
        rightInputIsBreakingChange: relation ? newFieldName !== relation.fieldOnRightModel.name : false,
      } as State)
    }
  }

  private switchToDisplayState = (displayState: RelationPopupDisplayState) => {
    if (displayState !== this.state.displayState) {
      this.setState({displayState: displayState} as State)
    }
  }

  private didSelectLeftModel = (model: Model) => {
    const {relation} = this.props.viewer

    this.setState(
      {
        leftSelectedModel: model,
      } as State,
      () => {
        this.setState({
          fieldOnRightModelName: this.rightFieldName(),
          fieldOnLeftModelName: this.leftFieldName(),
          leftModelIsBreakingChange: relation ? relation.leftModel.name !== model.name : false,
        } as State)
      })
  }

  private didSelectRightModel = (model: Model) => {
    const {relation} = this.props.viewer

    this.setState(
      {
        rightSelectedModel: model,
      } as State,
      () => {
        this.setState({
          fieldOnLeftModelName: this.leftFieldName(),
          fieldOnRightModelName: this.rightFieldName(),
          rightModelIsBreakingChange: relation ? relation.rightModel.name !== model.name : false,
        } as State)
      })
  }

  private didSelectCardinality = (cardinality: Cardinality) => {
    const {relation} = this.props.viewer
    this.setState(
      {
        selectedCardinality: cardinality,
      } as State,
      () => {
        const newLeftFieldName = this.leftFieldName()
        const newRightFieldName = this.rightFieldName()
        this.setState({
          fieldOnLeftModelName: newLeftFieldName,
          leftInputIsBreakingChange: relation ? newLeftFieldName !== relation.fieldOnLeftModel.name : false,
          fieldOnRightModelName: newRightFieldName,
          rightInputIsBreakingChange: relation ? newRightFieldName !== relation.fieldOnRightModel.name : false,
          cardinalityIsBreakingChange: relation ? this.cardinalityFromRelation(relation) !== cardinality : false,
        } as State)
      })
  }

  private onChangeRelationNameInput = (relationName: string) => {
    this.setState({
      relationName: relationName,
    } as State)
    if (this.props.viewer.relation) {
      this.setState({
        relationNameIsBreakingChange: relationName !== this.props.viewer.relation.name,
      } as State)
    }
  }

  private onChangeRelationDescriptionInput = (relationDescription: string) => {
    this.setState({
      relationDescription: relationDescription,
    } as State)
  }

  private addRelation = () => {
    Relay.Store.commitUpdate(
      new AddRelationMutation({
        projectId: this.props.viewer.project.id,
        name: this.state.relationName,
        description: this.state.relationDescription === '' ? null : this.state.relationDescription,
        leftModelId: this.state.leftSelectedModel.id,
        rightModelId: this.state.rightSelectedModel.id,
        fieldOnLeftModelName: this.leftFieldName(),
        fieldOnRightModelName: this.rightFieldName(),
        fieldOnLeftModelIsList: this.state.selectedCardinality.endsWith('MANY'),
        fieldOnRightModelIsList: this.state.selectedCardinality.startsWith('MANY'),
      }),
      {
        onSuccess: () => {
          console.log('SUCCESS')
          this.close()
        },
        onFailure: (transaction: Transaction) =>
          console.error('Could not create mutation: ', transaction.getError().message),
      },
    )
  }

  private editRelation = () => {
    Relay.Store.commitUpdate(
      new UpdateRelationMutation({
        relationId: this.props.viewer.relation.id,
        name: this.state.relationName,
        description: this.state.relationDescription === '' ? null : this.state.relationDescription,
        leftModelId: this.state.leftSelectedModel.id,
        rightModelId: this.state.rightSelectedModel.id,
        fieldOnLeftModelName: this.state.fieldOnLeftModelName,
        fieldOnRightModelName: this.state.fieldOnRightModelName,
        fieldOnLeftModelIsList: this.state.selectedCardinality.endsWith('MANY'),
        fieldOnRightModelIsList: this.state.selectedCardinality.startsWith('MANY'),
      }),
      {
        onSuccess: () => {
          // The force fetching because relations are too complicated to selective choose the config
          this.props.relay.forceFetch()
          this.close()
        },
        onFailure: (transaction: Transaction) =>
          console.error('Could not edit mutation: ', transaction.getError().message),
      },
    )
  }

  private deleteRelation = () => {
    Relay.Store.commitUpdate(
      new DeleteRelationMutation({
        relationId: this.props.viewer.relation.id,
        projectId: this.props.viewer.project.id,
        leftModelId: this.props.viewer.relation.leftModel.id,
        rightModelId: this.props.viewer.relation.leftModel.id,
      }),
      {
        onSuccess: () => {
          this.close()
        },
        onFailure: (transaction: Transaction) =>
          console.error('Could not edit mutation: ', transaction.getError().message),
      },
    )
  }

  private rightFieldName = () => {
    const {leftSelectedModel, rightSelectedModel, selectedCardinality} = this.state

    if (!leftSelectedModel) {
      return null
    }

    // edge case: self relations
    if ((leftSelectedModel && rightSelectedModel) && (leftSelectedModel.name === rightSelectedModel.name)) {
      if (selectedCardinality === 'ONE_TO_ONE') {
        return 'from' + rightSelectedModel.name
      } else if (selectedCardinality === 'ONE_TO_MANY') {
        return 'from' + rightSelectedModel.name
      } else if (selectedCardinality === 'MANY_TO_ONE') {
        return 'from' + rightSelectedModel.namePlural
      } else if (selectedCardinality === 'MANY_TO_MANY') {
        return 'from' + rightSelectedModel.namePlural
      }
    }

    //
    if (selectedCardinality.startsWith('MANY')) {
      return lowercaseFirstLetter(leftSelectedModel.namePlural)
    }
    return lowercaseFirstLetter(leftSelectedModel.name)
  }

  private rightFieldType = () => {
    const {leftSelectedModel, selectedCardinality} = this.state

    if (!leftSelectedModel) {
      return null
    }

    if (selectedCardinality.startsWith('MANY')) {
      return '[' + leftSelectedModel.name + ']'
    }
    return leftSelectedModel.name
  }

  private leftFieldName = () => {
    const {leftSelectedModel, rightSelectedModel, selectedCardinality} = this.state

    // edge case: self relations
    if ((leftSelectedModel && rightSelectedModel) && (leftSelectedModel.name === rightSelectedModel.name)) {
      if (selectedCardinality === 'ONE_TO_ONE') {
        return 'to' + rightSelectedModel.name
      } else if (selectedCardinality === 'ONE_TO_MANY') {
        return 'to' + rightSelectedModel.namePlural
      } else if (selectedCardinality === 'MANY_TO_ONE') {
        return 'to' + rightSelectedModel.name
      } else if (selectedCardinality === 'MANY_TO_MANY') {
        return 'to' + rightSelectedModel.namePlural
      }
    }

    if (!rightSelectedModel) {
      return null
    }
    if (selectedCardinality.endsWith('MANY')) {
      return lowercaseFirstLetter(rightSelectedModel.namePlural)
    }
    return lowercaseFirstLetter(rightSelectedModel.name)
  }

  private leftFieldType = () => {
    const {rightSelectedModel, selectedCardinality} = this.state

    if (!rightSelectedModel) {
      return null
    }
    if (selectedCardinality.endsWith('MANY')) {
      return '[' + rightSelectedModel.name + ']'
    }
    return rightSelectedModel.name
  }

  private cardinalityFromRelation (relation: Relation): Cardinality {
    const leftCardinalityValue = relation.fieldOnRightModel.isList ? 'MANY' : 'ONE'
    const rightCardinalityValue = relation.fieldOnLeftModel.isList ? 'MANY' : 'ONE'
    return (leftCardinalityValue + '_TO_' + rightCardinalityValue) as Cardinality
  }

  // leftSideMessagesForBreakingChange: string[]
  // rightSideMessagesForBreakingChange: string[]

  private breakingChangeMessages = (): string[] => {
    // sanity check since this will only ever be needed when there is already an existing relation
    if (!this.props.viewer.relation) {
      return []
    }

    let messages: string[] = []

    const relationNameIsBreakingChangeMessage = 'The relation was renamed to \'' + this.state.relationName +
      '\' (was \'' + this.props.viewer.relation.name + '\' before).'
    if (this.state.relationNameIsBreakingChange) {
      messages.push(relationNameIsBreakingChangeMessage)
    }

    const cardinalityIsBreakingChangeMessage = 'The cardinality of the relation was changed to ' +
      this.readableCardinalityString(this.state.selectedCardinality) + '\' (was \'' +
      this.readableCardinalityString(this.cardinalityFromRelation(this.props.viewer.relation)) + '\' before).'
    if (this.state.cardinalityIsBreakingChange) {
      messages.push(cardinalityIsBreakingChangeMessage)
    }

    // left field name
    const leftInputIsBreakingChangeMessage = 'The field on the left model (' + this.state.leftSelectedModel.name +
      ') was renamed to \'' + this.state.fieldOnLeftModelName + '\' (was \'' +
      this.props.viewer.relation.fieldOnLeftModel.name + '\' before).'
    if (this.state.leftInputIsBreakingChange) {
      messages.push(leftInputIsBreakingChangeMessage)
    }
    // else {
    //   const newLeftSideMessagesForBreakingChange =
    //     this.state.leftSideMessagesForBreakingChange.filter(msg => msg !== leftInputIsBreakingChangeMessage)
    //   this.setState({
    //     leftSideMessagesForBreakingChange: newLeftSideMessagesForBreakingChange,
    //   } as State)
    // }

    // right field name
    const rightInputIsBreakingChangeMessage = 'The field on the right model (' + this.state.rightSelectedModel.name +
      ') was renamed to \'' + this.state.fieldOnRightModelName + '\' (was \'' +
      this.props.viewer.relation.fieldOnRightModel.name + '\' before).'
    if (this.state.rightInputIsBreakingChange) {
      messages.push(rightInputIsBreakingChangeMessage)
    }
    // else {
    //   const newRightSideMessagesForBreakingChange =
    //     this.state.rightSideMessagesForBreakingChange.filter(msg => msg !== rightInputIsBreakingChangeMessage)
    //   this.setState({
    //     rightSideMessagesForBreakingChange: newRightSideMessagesForBreakingChange,
    //   } as State)
    // }

    // left model
    const leftModelIsBreakingChangeMessage = 'The left model was changed to \'' + this.state.leftSelectedModel.name +
      '\' (was \'' + this.props.viewer.relation.leftModel.name + '\' before).'
    if (this.state.leftModelIsBreakingChange) {
      messages.push(leftModelIsBreakingChangeMessage)
    }
    // else {
    //   const newLeftSideMessagesForBreakingChange =
    //     this.state.leftSideMessagesForBreakingChange.filter(msg => msg !== leftInputIsBreakingChangeMessage)
    //   this.setState({
    //     leftSideMessagesForBreakingChange: newLeftSideMessagesForBreakingChange,
    //   } as State)
    // }

    // right model
    const rightModelIsBreakingChangeMessage = 'The right model was changed to \'' + this.state.rightSelectedModel.name +
      '\' (was \'' + this.props.viewer.relation.rightModel.name + '\' before).'
    if (this.state.rightModelIsBreakingChange) {
      messages.push(rightModelIsBreakingChangeMessage)
    }
    // else {
    //   const newRightSideMessagesForBreakingChange =
    //     this.state.rightSideMessagesForBreakingChange.filter(msg => msg !== rightInputIsBreakingChangeMessage)
    //   this.setState({
    //     rightSideMessagesForBreakingChange: newRightSideMessagesForBreakingChange,
    //   } as State)
    // }

    return messages
  }

  private readableCardinalityString = (cardinality: Cardinality): string => {
    switch (cardinality) {
      case 'ONE_TO_ONE': return 'One-To-One'
      case 'ONE_TO_MANY': return 'One-To-Many'
      case 'MANY_TO_ONE': return 'Many-To-One'
      case 'MANY_TO_MANY': return 'Many-To-Many'
    }
  }

  private resetToInitialState = () => {
    const {relation} = this.props.viewer
    this.setState({
      displayState: 'DEFINE_RELATION' as RelationPopupDisplayState,
      leftSelectedModel: relation ? relation.leftModel : null,
      rightSelectedModel: relation ? relation.rightModel : null,
      selectedCardinality: relation ?
        this.cardinalityFromRelation(relation) : 'ONE_TO_ONE' as Cardinality,
      relationName: relation ? relation.name : '',
      relationDescription: relation ? relation.description : '',
      fieldOnLeftModelName: relation ? relation.fieldOnLeftModel.name : null,
      fieldOnRightModelName: relation ? relation.fieldOnRightModel.name : null,
      leftInputIsBreakingChange: false,
      rightInputIsBreakingChange: false,
      relationNameIsBreakingChange: false,
      leftModelIsBreakingChange: false,
      rightModelIsBreakingChange: false,
      cardinalityIsBreakingChange: false,
    })
  }

}

export default Relay.createContainer(withRouter(CreateRelationPopup), {
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
            namePlural
          }
          rightModel {
            id
            name
            namePlural
          }
        }
        project: projectByName(projectName: $projectName) {
          id
          models(first: 1000) {
            edges {
              node {
                id
                name
                namePlural
              }
            }
          }
          fields(first: 1000) {
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
