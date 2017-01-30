import * as React from 'react'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import {RelationPopupDisplayState} from '../../types/types'

interface Props {
  displayState: RelationPopupDisplayState
}

export default class CreateRelationHeader extends React.Component<Props, {}> {

  render() {

    const {displayState} = this.props

    return (
      <div className={`flex itemsEnd justifyBetween
        ${this.props.displayState === 'DEFINE_RELATION' ? 'bgBlack02' : 'bgWhite'}`}>
        <style jsx={true}>{`

          .newRelationBanner {
            @inherit: .pv4, .ph6, .white, .bgGreen, .br2, .f12, .fw6, .ttu;
            margin-left: -3px;
          }

          .titleTab {
            @inherit: .pv16, .mh6, .ph10, .f12, .fw6, .ttu;
          }

          .selectedTitle {
            border-bottom-color: rgba(42,189,60,.3);
            border-bottom-width: 3px;
            margin-bottom: -2px;
          }

          .closeIcon {
            margin-bottom: -8px;
          }

        `}</style>
        <div className='flex itemsCenter bb bBlack10 w100'>
          <div className='pr6  mr6'>
            <div className='newRelationBanner'>New Relation</div>
          </div>
          <div className={`titleTab ${displayState === 'DEFINE_RELATION' ? 'green' : 'black30'}`}>
            Define Relations
          </div>
          <div className={`titleTab ${displayState === 'SET_MUTATIONS' ? 'green' : 'black30'}`}>
            Set Mutations
          </div>
        </div>
        <Icon
          className='mh25 closeIcon'
          src={require('../../assets/icons/close_modal.svg')}
          width={25}
          height={25}
        />
      </div>
    )
  }
}
