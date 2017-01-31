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
  // fieldOnLeftModelName: string
  // fieldOnRightModelName: string
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

    console.log('RELATION: ', relation)

    this.state = {
      displayState: 'DEFINE_RELATION' as RelationPopupDisplayState,
      leftSelectedModel: relation ? relation.leftModel : null,
      rightSelectedModel: relation ? relation.rightModel : null,
      selectedCardinality: relation ?
        this.cardinalityFromRelation(relation) : 'ONE_TO_ONE' as Cardinality,
      relationName: relation ? relation.name : '',
      relationDescription: relation ? relation.description : '',
    }

    console.log('STATE: ', this.state)
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
                      rightFieldName={this.rightFieldName()}
                      rightFieldType={this.rightFieldType()}
                      leftFieldName={this.leftFieldName()}
                      leftFieldType={this.leftFieldType()}
                    />
                    :
                    <SetMutation
                      relationName={relationName}
                      relationDescription={relationDescription}
                      onChangeRelationNameInput={this.onChangeRelationNameInput}
                      onChangeRelationDescriptionInput={this.onChangeRelationDescriptionInput}
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

  private switchToDisplayState = (displayState: RelationPopupDisplayState) => {
    if (displayState !== this.state.displayState) {
      this.setState({displayState: displayState} as State)
    }
  }

  private didSelectLeftModel = (model: Model) => {
    this.setState({leftSelectedModel: model} as State)
  }

  private didSelectRightModel = (model: Model) => {
    this.setState({rightSelectedModel: model} as State)
  }

  private didSelectCardinality = (cardinality: Cardinality) => {
    this.setState({selectedCardinality: cardinality} as State)
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
        onFailure: (transaction: Transaction) => console.error('Could not create mutation: ', transaction.getError().message),
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
        fieldOnLeftModelName: this.leftFieldName(),
        fieldOnRightModelName: this.rightFieldName(),
        fieldOnLeftModelIsList: this.state.selectedCardinality.endsWith('MANY'),
        fieldOnRightModelIsList: this.state.selectedCardinality.startsWith('MANY'),
      }),
      {
        onSuccess: () => {
          // The force fetching because relations are too complicated to selective choose the config
          this.props.relay.forceFetch()
          this.close()
        },
        onFailure: (transaction: Transaction) => console.error('Could not edit mutation: ', transaction.getError().message),
      },
    )
  }

  private rightFieldName = () => {
    // return 'rightFieldName'
    if (!this.state.leftSelectedModel) {
      return null
    }
    if (this.state.selectedCardinality.startsWith('MANY')) {
      return lowercaseFirstLetter(this.state.leftSelectedModel.namePlural)
    }
    return lowercaseFirstLetter(this.state.leftSelectedModel.name)
  }

  private rightFieldType = () => {
    // return 'rightFieldType'
    if (!this.state.leftSelectedModel) {
      return null
    }
    if (this.state.selectedCardinality.startsWith('MANY')) {
      return '[' + this.state.leftSelectedModel.name + ']'
    }
    return this.state.leftSelectedModel.name
  }

  private leftFieldName = () => {
    // return 'leftFieldName'
    if (!this.state.rightSelectedModel) {
      return null
    }
    if (this.state.selectedCardinality.endsWith('MANY')) {
      return lowercaseFirstLetter(this.state.rightSelectedModel.namePlural)
    }
    return lowercaseFirstLetter(this.state.rightSelectedModel.name)
  }

  private leftFieldType = () => {
    // return 'leftFieldType'
    if (!this.state.rightSelectedModel) {
      return null
    }
    if (this.state.selectedCardinality.endsWith('MANY')) {
      return '[' + this.state.rightSelectedModel.name + ']'
    }
    return this.state.rightSelectedModel.name
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
