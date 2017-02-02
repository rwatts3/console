import * as React from 'react'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import {RelationPopupDisplayState} from '../../types/types'
import BreakingChangeIndicator from './BreakingChangeIndicator'

interface Props {
  displayState: RelationPopupDisplayState
  switchDisplayState: Function
  close: Function
  breakingChanges: boolean[] // contains two values (one per tab), true if tab has breaking changes
}

export default class CreateRelationHeader extends React.Component<Props, {}> {

  private breakingChangeIndicatorOffsets = [27, 49]

  render() {

    const {displayState} = this.props
    let offsets: number[] = []
    this.props.breakingChanges.forEach((breakingChange, i) => {
      if (breakingChange) {
        offsets.push(this.breakingChangeIndicatorOffsets[i])
      }
    })
    let plain: boolean[] = offsets.map(_ => true)

    const leftTabColor = displayState === 'DEFINE_RELATION' ? 'green' : 'black30'
    const rightTabColor = displayState === 'SET_MUTATIONS' ? 'green' : 'black30'

    console.log(leftTabColor, rightTabColor)

    return (
      <div className={`flex itemsEnd justifyBetween
        ${displayState === 'DEFINE_RELATION' ? 'bgBlack02' : 'bgWhite'}`}>
        <style jsx={true}>{`

          .newRelationBanner {
            @inherit: .pv4, .ph6, .white, .bgGreen, .br2, .f12, .fw6, .ttu;
            margin-left: -3px;
          }

          .titleTab {
            @inherit: .pv16, .mh6, .ph10, .f12, .fw6, .ttu, .pointer;
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
        <BreakingChangeIndicator
          className='flex itemsCenter bb bBlack10 w100'
          indicatorStyle='TOP'
          width={16}
          height={20}
          offsets={offsets}
          plain={plain}
          >
          <div className='pr6  mr6'>
            <div className='newRelationBanner'>New Relation</div>
          </div>
          <div
            className={`titleTab ${leftTabColor}`}
            onClick={() => this.props.switchDisplayState('DEFINE_RELATION' as RelationPopupDisplayState)}
          >
            Define Relations
          </div>
          <div
            className={`titleTab ${rightTabColor}`}
            onClick={() => this.props.switchDisplayState('SET_MUTATIONS' as RelationPopupDisplayState)}
          >
            Set Mutations
          </div>
        </BreakingChangeIndicator>
        <div
          className='pointer'
          onClick={() => this.props.close()}
        >
          <Icon
            className='mh25 closeIcon'
            src={require('../../assets/icons/close_modal.svg')}
            width={25}
            height={25}
          />
        </div>
      </div>
    )
  }
}
