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
  rightFieldName: string
  rightFieldType: string
  leftFieldName: string
  leftFieldType: string
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
            relatedFieldName={this.props.rightSelectedModel && this.props.leftFieldName}
            relatedFieldType={this.props.rightSelectedModel && this.props.leftFieldType}
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
            relatedFieldName={this.props.leftSelectedModel && this.props.rightFieldName}
            relatedFieldType={this.props.leftSelectedModel && this.props.rightFieldType}
          />
        </div>
      </div>
    )
  }

}
