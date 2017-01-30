import * as React from 'react'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import {Relation} from '../../types/types'

interface Props {
  expanded: boolean
  relation?: Relation
}

export default class RelationInfo extends React.Component<Props, {}> {

  render() {
    return !this.props.expanded ?
        (
          <div className='flex justifyEnd pr16 pb16 mt10'>
            <Icon
              className='pointer'
              src={require('../../assets/icons/info_blue.svg')}
              width={29}
              height={29}
            />
          </div>
        )
      :
        (
          <div></div>
        )
  }
}
