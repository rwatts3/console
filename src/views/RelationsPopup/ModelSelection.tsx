import * as React from 'react'
import ModelSelectionBox from './ModelSelectionBox'
import CardinalitySelection from './CardinalitySelection'
import {Cardinality, Model} from '../../types/types'
import {lowercaseFirstLetter} from '../../utils/utils'

interface Props {
  models: Model[]
  leftSelectedModel: Model | null
  rightSelectedModel: Model | null
  selectedCardinality: Cardinality
  didSelectLeftModel: Function
  didSelectRightModel: Function
  didSelectCardinality: Function
}

export default class ModelSelection extends React.Component<Props, {}> {

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
            didSelectedModel={this.props.didSelectLeftModel}
            selectedModel={this.props.leftSelectedModel}
            relatedFieldName={this.props.rightSelectedModel && this.leftFieldName()}
            relatedFieldType={this.props.rightSelectedModel && this.leftFieldType()}
          />
          <div className='greenLine' />
        </div>
        <CardinalitySelection
          selectedCartinality={this.props.selectedCardinality}
          didSelectCardinality={this.props.didSelectCardinality}
        />
        <div className='flex itemsCenter'>
          <div className='greenLine' />
          <ModelSelectionBox
            many={false}
            models={this.props.models}
            didSelectedModel={this.props.didSelectRightModel}
            selectedModel={this.props.rightSelectedModel}
            relatedFieldName={this.props.leftSelectedModel && this.rightFieldName()}
            relatedFieldType={this.props.leftSelectedModel && this.rightFieldType()}
          />
        </div>
      </div>
    )
  }

  private rightFieldName = () => {
    if (!this.props.leftSelectedModel) {
      return null
    }
    if (this.props.selectedCardinality.startsWith('MANY')) {
      return lowercaseFirstLetter(this.props.leftSelectedModel.namePlural)
    }
    return lowercaseFirstLetter(this.props.leftSelectedModel.name)
  }

  private rightFieldType = () => {
    if (!this.props.leftSelectedModel) {
      return null
    }
    if (this.props.selectedCardinality.startsWith('MANY')) {
      return '[' + this.props.leftSelectedModel.name + ']'
    }
    return this.props.leftSelectedModel.name
  }

  private leftFieldName = () => {
    if (!this.props.rightSelectedModel) {
      return null
    }
    if (this.props.selectedCardinality.endsWith('MANY')) {
      return lowercaseFirstLetter(this.props.rightSelectedModel.namePlural)
    }
    return lowercaseFirstLetter(this.props.rightSelectedModel.name)
  }

  private leftFieldType = () => {
    if (!this.props.rightSelectedModel) {
      return null
    }
    if (this.props.selectedCardinality.endsWith('MANY')) {
      return '[' + this.props.rightSelectedModel.name + ']'
    }
    return this.props.rightSelectedModel.name
  }

}
