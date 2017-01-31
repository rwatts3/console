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
        />
        <RelationInfo
          leftModel={this.props.leftSelectedModel}
          rightModel={this.props.rightSelectedModel}
          cardinality={this.props.selectedCardinality}
        />
      </div>
    )
  }

}
