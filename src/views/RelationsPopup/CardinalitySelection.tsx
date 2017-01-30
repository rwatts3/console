import * as React from 'react'
import {$v, Icon} from 'graphcool-styles'
import {Cardinality} from '../../types/types'

interface Props {
  selectedCartinality: Cardinality
}

export default class CardinalitySelection extends React.Component<Props, {}> {

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .flex, .flexColumn, .mh16;
          }
        `}</style>
        <Icon
          src={require('../../assets/icons/one_to_one.svg')}
          width={31}
          height={30}
          color={this.props.selectedCartinality === 'ONE_TO_ONE' ? $v.green : $v.gray20}
        />
        <Icon
          className='pv6'
          src={require('../../assets/icons/one_to_many.svg')}
          width={31}
          height={30}
        />
        <Icon
          className='pv6'
          src={require('../../assets/icons/many_to_one.svg')}
          width={31}
          height={30}
        />
        <Icon
          className='pv6'
          src={require('../../assets/icons/many_to_many.svg')}
          width={31}
          height={30}
        />
      </div>
    )
  }
}
