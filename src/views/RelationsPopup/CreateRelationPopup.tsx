import * as React from 'react'
import {RelationPopupDisplayState} from '../../types/types'
import CreateRelationHeader from './CreateRelationHeader'
import PopupWrapper from '../../components/PopupWrapper/PopupWrapper'
import {withRouter} from 'react-router'
import CreateRelationFooter from './CreateRelationFooter'
import DefineRelation from './DefineRelation'
import SetMutation from './SetMutation'

interface State {
  displayState: RelationPopupDisplayState
}

interface Props {
  router: ReactRouter.InjectedRouter
}

class CreateRelationPopup extends React.Component<Props, State> {

  state = {
    // displayState: 'DEFINE_RELATION' as RelationPopupDisplayState,
    displayState: 'SET_MUTATIONS' as RelationPopupDisplayState,
  }

  render() {
    return (
      <PopupWrapper onClickOutside={this.close}>
        <style jsx={true}>{`
          .content {
            @inherit: .buttonShadow;
            width: 700px;
          }
        `}</style>
        <div className='flex itemsCenter justifyCenter w100 h100'>
          <div className={`content ${this.state.displayState === 'DEFINE_RELATION' ? 'bgBlack02' : 'bgWhite'}`}>
            <CreateRelationHeader
              displayState={this.state.displayState}
            />
            {
              this.state.displayState === 'DEFINE_RELATION' ?
                <DefineRelation />
                :
                <SetMutation />
            }
            <CreateRelationFooter
              displayState={this.state.displayState}
            />
          </div>
        </div>
      </PopupWrapper>
    )
  }

  private close = () => {
    this.props.router.goBack()
  }
}

export default withRouter(CreateRelationPopup)
