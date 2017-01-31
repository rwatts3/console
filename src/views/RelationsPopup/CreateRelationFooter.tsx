import * as React from 'react'
import {RelationPopupDisplayState} from '../../types/types'
import {Icon} from 'graphcool-styles'

interface Props {
  displayState: RelationPopupDisplayState
  switchDisplayState: Function
}

export default class CreateRelationFooter extends React.Component<Props, {}> {

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .flex, .ph25, .pv16, .justifyBetween, .itemsCenter, .bt, .bBlack10, .bgBlack02;
            height: 77px;
          }

          .toggleDisplayStateButton {
            @inherit: .blue, .f14, .fw6, .ttu, .pointer;
          }

          .saveButton {
            @inherit: .white, .bgGreen, .pv10, .ph16, .f16, .pointer, .br2;
          }

        `}</style>
        <div className='f16 black50 pointer'>Cancel</div>
        {this.props.displayState === 'DEFINE_RELATION' ?
          (
            <div className='flex itemsCenter'>
              <div
                className='toggleDisplayStateButton'
                onClick={() => this.props.switchDisplayState('SET_MUTATION')}
              >
                Set Mutations
              </div>
              <Icon
                className='ml6'
                src={require('../../assets/icons/blue_arrow_left.svg')}
                width={17}
                height={12}
                rotate={180}
              />
            </div>
          )
          :
          (
            <div className='flex itemsCenter'>
              <Icon
                className='mr6'
                src={require('../../assets/icons/blue_arrow_left.svg')}
                width={17}
                height={12}
              />
              <div
                className='toggleDisplayStateButton'
                onClick={() => this.props.switchDisplayState('DEFINE_RELATION')}
              >
                Define Relations
              </div>
              <div className='saveButton ml25'>Create Relation</div>
            </div>
          )
        }
      </div>
    )
  }
}
