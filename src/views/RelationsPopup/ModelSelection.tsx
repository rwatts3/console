import * as React from 'react'
import ModelSelectionBox from './ModelSelectionBox'
import CardinalitySelection from './CardinalitySelection'
import {Cardinality, Model} from '../../types/types'
import {lowercaseFirstLetter} from '../../utils/utils'

interface State {
  leftSelectedModel: Model | null
  rightSelectedModel: Model | null
  selectedCardinality: Cardinality
}

interface Props {
  models: Model[]

}

export default class ModelSelection extends React.Component<Props, State> {

  state = {
    leftSelectedModel: null,
    rightSelectedModel: null,
    selectedCardinality: 'ONE_TO_ONE' as Cardinality,
  }

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .flex, .ph38, .pt16, .justifyBetween;
            height: 275px;
          }

          .greenLine {
            @inherit: .bgLightgreen20;
            height: 2px;
            width: 70px;
          }
        `}</style>
        <div className='flex itemsCenter'>
          <ModelSelectionBox
            many={false}
            models={this.props.models}
            didSelectedModel={this.didSelectLeftModel}
            selectedModel={this.state.leftSelectedModel}
            relatedFieldName={this.state.rightSelectedModel && this.leftFieldName()}
            relatedFieldType={this.state.rightSelectedModel && this.leftFieldType()}
          />
          <div className='greenLine' />
        </div>
        <CardinalitySelection
          selectedCartinality={this.state.selectedCardinality}
          didSelectCardinality={this.didSelectCardinality}
        />
        <div className='flex itemsCenter'>
          <div className='greenLine' />
          <ModelSelectionBox
            many={false}
            models={this.props.models}
            didSelectedModel={this.didSelectRightModel}
            selectedModel={this.state.rightSelectedModel}
            relatedFieldName={this.state.leftSelectedModel && this.rightFieldName()}
            relatedFieldType={this.state.leftSelectedModel && this.rightFieldType()}
          />
        </div>
      </div>
    )
  }

  private rightFieldName = () => {
    if (!this.state.leftSelectedModel) {
      return null
    }
    if (this.state.selectedCardinality.endsWith('MANY')) {
      return lowercaseFirstLetter(this.state.leftSelectedModel.namePlural)
    }
    return lowercaseFirstLetter(this.state.leftSelectedModel.name)
  }

  private rightFieldType = () => {
    if (!this.state.leftSelectedModel) {
      return null
    }
    if (this.state.selectedCardinality.endsWith('MANY')) {
      return '[' + this.state.leftSelectedModel.name + ']'
    }
    return this.state.leftSelectedModel.name
  }

  private leftFieldName = () => {
    if (!this.state.rightSelectedModel) {
      return null
    }
    if (this.state.selectedCardinality.startsWith('MANY')) {
      return lowercaseFirstLetter(this.state.rightSelectedModel.namePlural)
    }
    return lowercaseFirstLetter(this.state.rightSelectedModel.name)
  }

  private leftFieldType = () => {
    if (!this.state.rightSelectedModel) {
      return null
    }
    if (this.state.selectedCardinality.startsWith('MANY')) {
      return '[' + this.state.rightSelectedModel.name + ']'
    }
    return this.state.rightSelectedModel.name
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

}
