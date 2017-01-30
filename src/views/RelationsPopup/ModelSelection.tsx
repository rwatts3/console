import * as React from 'react'
import ModelSelectionBox from './ModelSelectionBox'
import CardinalitySelection from './CardinalitySelection'
import {Cardinality} from '../../types/types'

interface Props {

}

export default class ModelSelection extends React.Component<Props, {}> {

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .flex, .ph38, .pt38, .justifyBetween, .h100;
          }

          .greenLine {
            @inherit: .bgLightgreen20;
            height: 2px;
            width: 70px;
          }
        `}</style>
        <div className='flex itemsCenter'>
          <ModelSelectionBox
            relatedField={null}
            many={false}
          />
          <div className='greenLine' />
        </div>
        <CardinalitySelection
          selectedCartinality={'ONE_TO_ONE' as Cardinality}
        />
        <div className='flex itemsCenter'>
          <div className='greenLine' />
          <ModelSelectionBox
            relatedField={null}
            many={false}
          />
        </div>
      </div>
    )
  }
}
