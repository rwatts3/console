import * as React from 'react'
import ModelSelection from './ModelSelection'
import RelationInfo from './RelationInfo'
import {Model, Cardinality} from '../../types/types'

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
  forbiddenFieldNames: string[]
  // leftSideMessagesForBreakingChange: string[]
  // rightSideMessagesForBreakingChange: string[]
}

export default class DefineRelation extends React.Component<Props, {}> {

  render() {
    return (
      <div className='bgBlack02'>
        <ModelSelection
          models={this.props.models}
          leftSelectedModel={this.props.leftSelectedModel}
          rightSelectedModel={this.props.rightSelectedModel}
          selectedCardinality={this.props.selectedCardinality}
          didSelectLeftModel={this.props.didSelectLeftModel}
          didSelectRightModel={this.props.didSelectRightModel}
          didSelectCardinality={this.props.didSelectCardinality}
          rightFieldName={this.props.rightFieldName}
          rightFieldType={this.props.rightFieldType}
          leftFieldName={this.props.leftFieldName}
          leftFieldType={this.props.leftFieldType}
          didChangeFieldNameOnLeftModel={this.props.didChangeFieldNameOnLeftModel}
          didChangeFieldNameOnRightModel={this.props.didChangeFieldNameOnRightModel}
          fieldOnLeftModelName={this.props.fieldOnLeftModelName}
          fieldOnRightModelName={this.props.fieldOnRightModelName}
          leftInputIsBreakingChange={this.props.leftInputIsBreakingChange}
          rightInputIsBreakingChange={this.props.rightInputIsBreakingChange}
          leftModelIsBreakingChange={this.props.leftModelIsBreakingChange}
          rightModelIsBreakingChange={this.props.rightModelIsBreakingChange}
          forbiddenFieldNames={this.props.forbiddenFieldNames}
        />
        <RelationInfo
          leftModel={this.props.leftSelectedModel}
          rightModel={this.props.rightSelectedModel}
          cardinality={this.props.selectedCardinality}
          fieldOnLeftModelName={this.props.fieldOnLeftModelName}
          fieldOnRightModelName={this.props.fieldOnRightModelName}
        />
      </div>
    )
  }

}
