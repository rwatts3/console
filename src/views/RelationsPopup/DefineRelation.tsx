import * as React from 'react'
import ModelSelection from './ModelSelection'
import RelationInfo from './RelationInfo'
import {Model, Cardinality} from '../../types/types'

interface Props {
  models: Model[]
}

interface State {
  leftSelectedModel: Model | null
  rightSelectedModel: Model | null
  selectedCardinality: Cardinality
}

export default class DefineRelation extends React.Component<Props, State> {

  state = {
    leftSelectedModel: null,
    rightSelectedModel: null,
    selectedCardinality: 'ONE_TO_ONE' as Cardinality,
  }

  render() {
    return (
      <div className='bgBlack02'>
        <ModelSelection
          models={this.props.models}
          leftSelectedModel={this.state.leftSelectedModel}
          rightSelectedModel={this.state.rightSelectedModel}
          selectedCardinality={this.state.selectedCardinality}
          didSelectLeftModel={this.didSelectLeftModel}
          didSelectRightModel={this.didSelectRightModel}
          didSelectCardinality={this.didSelectCardinality}
        />
        <RelationInfo
          leftModel={this.state.leftSelectedModel}
          rightModel={this.state.rightSelectedModel}
          cardinality={this.state.selectedCardinality}
        />
      </div>
    )
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
