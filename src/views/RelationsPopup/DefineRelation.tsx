import * as React from 'react'
import ModelSelection from './ModelSelection'
import RelationInfo from './RelationInfo'
import {Model} from '../../types/types'

interface Props {
  models: Model[]
}

export default class DefineRelation extends React.Component<Props, {}> {

  render() {
    return (
      <div className='bgBlack02'>
        <ModelSelection
          models={this.props.models}
        />
        <RelationInfo />
      </div>
    )
  }
}
