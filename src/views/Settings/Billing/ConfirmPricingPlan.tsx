import * as React from 'react'
import {PricingPlan, Viewer} from '../../../types/types'
import PopupWrapper from '../../../components/PopupWrapper/PopupWrapper'
import {withRouter} from 'react-router'
import {Icon} from 'graphcool-styles'
import CreditCardInputSection from './CreditCardInputSection'
import * as Relay from 'react-relay'

interface Props {
  currentPlan: PricingPlan
  router: ReactRouter.InjectedRouter
  viewer: Viewer
}

class ConfirmPricingPlan extends React.Component<Props, {}> {

  render() {
    return (
      <PopupWrapper
        onClickOutside={this.close}
      >
        <style jsx={true}>{`
          .container {
            @p: .bgWhite, .flex, .flexColumn, .itemsCenter, .buttonShadow;
            width: 800px;
          }
        `}</style>

        <div className='flex itemsCenter justifyCenter w100 h100 bgWhite90'>

          <div className='container'>
            <div
              className='flex justifyEnd w100 pointer pt38'
              onClick={() => this.close()}
            >
              <Icon
                className='mh25 closeIcon'
                src={require('../../../assets/icons/close_modal.svg')}
                width={25}
                height={25}
              />
            </div>
            <div className='f38 fw3'>Confirm plan</div>
            <div className='f16 black50 mt10 mb38'>Please enter your credit card information to proceed.</div>
            <CreditCardInputSection
              plan={this.props.currentPlan}
              projectId={this.props.viewer.project.id}
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

export default Relay.createContainer(withRouter(ConfirmPricingPlan), {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
        },
      }
    `},
})

