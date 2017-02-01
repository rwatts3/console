import * as React from 'react'
import * as Relay from 'react-relay'
import {RelationPopupDisplayState, Viewer, Cardinality, Model, Relation} from '../../types/types'
import CreateRelationHeader from './CreateRelationHeader'
import PopupWrapper from '../../components/PopupWrapper/PopupWrapper'
import {withRouter} from 'react-router'
import CreateRelationFooter from './CreateRelationFooter'
import DefineRelation from './DefineRelation'
import SetMutation from './SetMutation'
import AddRelationMutation from '../../mutations/AddRelationMutation'
import UpdateRelationMutation from '../../mutations/UpdateRelationMutation'
import {Transaction} from 'react-relay'
import {lowercaseFirstLetter} from '../../utils/utils'

interface State {
  displayState: RelationPopupDisplayState
  leftSelectedModel: Model | null
  rightSelectedModel: Model | null
  selectedCardinality: Cardinality
  relationName: string
  relationDescription: string
  fieldOnLeftModelName: string | null
  fieldOnRightModelName: string | null
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
    }
  }

  render() {

    const models = this.props.viewer.project.models.edges.map(edge => edge.node)
    const {displayState, leftSelectedModel, rightSelectedModel,
      selectedCardinality, relationName, relationDescription} = this.state

    return (
      <PopupWrapper onClickOutside={this.close}>
        <style jsx={true}>{`
          .content {
            @inherit: .buttonShadow;
            width: 700px;
          }
        `}</style>
        <div className='flex itemsCenter justifyCenter w100 h100'>
          <div className='content'>
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
                      rightFieldName={this.state.fieldOnRightModelName}
                      rightFieldType={this.rightFieldType()}
                      leftFieldName={this.state.fieldOnLeftModelName}
                      leftFieldType={this.leftFieldType()}
                      didChangeFieldNameOnLeftModel={this.didChangeFieldNameOnLeftModel}
                      didChangeFieldNameOnRightModel={this.didChangeFieldNameOnRightModel}
                      fieldOnLeftModelName={this.state.fieldOnLeftModelName}
                      fieldOnRightModelName={this.state.fieldOnRightModelName}
                    />
                    :
                    <SetMutation
                      relationName={relationName}
                      relationDescription={relationDescription}
                      onChangeRelationNameInput={this.onChangeRelationNameInput}
                      onChangeRelationDescriptionInput={this.onChangeRelationDescriptionInput}
                      leftSelectedModel={this.state.leftSelectedModel}
                      rightSelectedModel={this.state.rightSelectedModel}
                      selectedCardinality={this.state.selectedCardinality}
                      fieldOnLeftModelName={this.state.fieldOnLeftModelName}
                      fieldOnRightModelName={this.state.fieldOnRightModelName}
                    />
                }
              </div>
              <CreateRelationFooter
                displayState={displayState}
                switchDisplayState={this.switchToDisplayState}
                onClickCreateRelation={this.addRelation}
                onClickEditRelation={this.editRelation}
                canSubmit={leftSelectedModel && rightSelectedModel && relationName.length > 0}
                isEditingExistingRelation={this.props.viewer.relation !== null}
                close={this.close}
              />
            </div>
          </div>
        </div>
      </PopupWrapper>
    )
  }

  private close = () => {
    this.props.router.goBack()
  }

  private didChangeFieldNameOnLeftModel = (newFieldName: string) => {
    this.setState({
      fieldOnLeftModelName: newFieldName,
    } as State)
  }

  private didChangeFieldNameOnRightModel = (newFieldName: string) => {
    this.setState({
      fieldOnRightModelName: newFieldName,
    } as State)
  }

  private switchToDisplayState = (displayState: RelationPopupDisplayState) => {
    if (displayState !== this.state.displayState) {
      this.setState({displayState: displayState} as State)
    }
  }

  private didSelectLeftModel = (model: Model) => {
    this.setState(
      {
        leftSelectedModel: model,
      } as State,
      () => {
        this.setState({
          fieldOnRightModelName: this.rightFieldName(),
          fieldOnLeftModelName: this.leftFieldName(),
        } as State)
      })
  }

  private didSelectRightModel = (model: Model) => {
    this.setState(
      {
        rightSelectedModel: model,
      } as State,
      () => {
        this.setState({
          fieldOnLeftModelName: this.leftFieldName(),
          fieldOnRightModelName: this.rightFieldName(),
        } as State)
      })
  }

  private didSelectCardinality = (cardinality: Cardinality) => {
    this.setState(
      {
        selectedCardinality: cardinality,
      } as State,
      () => {
        this.setState({
          fieldOnLeftModelName: this.leftFieldName(),
          fieldOnRightModelName: this.rightFieldName(),
        } as State)
      })
  }

  private onChangeRelationNameInput = (relationName: string) => {
    this.setState({
      relationName: relationName,
    } as State)
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
        }
      }
    `,
  },
})
