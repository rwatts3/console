import * as React from 'react'
import ModelSelection from './ModelSelection'
import RelationInfo from './RelationInfo'

interface Props {
}

export default class DefineRelation extends React.Component<Props, {}> {

  render() {
    return (
      <div className='bgBlack02 h100'>
        <ModelSelection />
        <RelationInfo />
      </div>
    )
  }
}
