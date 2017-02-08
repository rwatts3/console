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
  didChangeFieldNameOnLeftModel: (newFieldName: string) => void
  didChangeFieldNameOnRightModel: (newFieldName: string) => void
  fieldOnLeftModelName: string | null
  fieldOnRightModelName: string | null
  leftInputIsBreakingChange: boolean
  rightInputIsBreakingChange: boolean
  leftModelIsBreakingChange: boolean
  rightModelIsBreakingChange: boolean
  forbiddenFieldNamesForLeftModel: string[]
  forbiddenFieldNamesForRightModel: string[]
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

          .topMargin20 {
            margin-top: 0px;
          }
        `}</style>
        <div className={`flex itemsCenter ${this.props.selectedCardinality.startsWith('MANY') && 'topMargin20'}`}>
          <ModelSelectionBox
            many={this.props.selectedCardinality.startsWith('MANY')}
            models={this.props.models}
            didSelectedModel={this.props.didSelectLeftModel}
            selectedModel={this.props.leftSelectedModel}
            relatedFieldName={this.props.fieldOnLeftModelName}
            relatedFieldType={this.props.rightSelectedModel && this.props.leftFieldType}
            didChangeFieldName={this.props.didChangeFieldNameOnLeftModel}
            inputIsBreakingChange={this.props.leftInputIsBreakingChange}
            modelIsBreakingChange={this.props.leftModelIsBreakingChange}
            forbiddenFieldNames={this.props.forbiddenFieldNamesForLeftModel}
          />
          <div className='greenLine' />
        </div>
        <CardinalitySelection
          selectedCartinality={this.props.selectedCardinality}
          didSelectCardinality={this.props.didSelectCardinality}
        />
        <div className={`flex itemsCenter ${this.props.selectedCardinality.endsWith('MANY') && 'topMargin20'}`}>
          <div className='greenLine' />
          <ModelSelectionBox
            many={this.props.selectedCardinality.endsWith('MANY')}
            models={this.props.models}
            didSelectedModel={this.props.didSelectRightModel}
            selectedModel={this.props.rightSelectedModel}
            relatedFieldName={this.props.fieldOnRightModelName}
            relatedFieldType={this.props.leftSelectedModel && this.props.rightFieldType}
            didChangeFieldName={this.props.didChangeFieldNameOnRightModel}
            inputIsBreakingChange={this.props.rightInputIsBreakingChange}
            modelIsBreakingChange={this.props.rightModelIsBreakingChange}
            forbiddenFieldNames={this.props.forbiddenFieldNamesForRightModel}
          />
        </div>
      </div>
    )
  }

}
