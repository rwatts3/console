import * as React from 'react'
import ModelSelection from './ModelSelection'
import RelationInfo from './RelationInfo'

interface State {

}

interface Props {

}

export default class DefineRelation extends React.Component<Props, State> {

  state = {

  }

  render() {
    return (
      <div className='bgBlack02'>
        <ModelSelection />
        <RelationInfo
          expanded={false}
        />
      </div>
    )
  }
}
