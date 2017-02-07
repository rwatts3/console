import * as React from 'react'
import {PricingPlan} from '../../../types/types'
import PopupWrapper from '../../../components/PopupWrapper/PopupWrapper'
import PricingColumn from '../PricingColumn'

interface Props {
  currentPlan: PricingPlan
  router: ReactRouter.InjectedRouter
}

export default class ChangePricingPlan extends React.Component<Props, {}> {

  plans: [PricingPlan] = ['Developer', 'Startup', 'Growth', 'Pro']

  componentDidMount() {
    console.log('ChangePRicingPlan, componentDidMount')
  }

  render() {
    return (
      <PopupWrapper
        onClickOutside={this.close}
      >
        <style jsx={true}>{`
          .container {
            @p: .flex;
            width: 500px;
            height: 500px;
          }
        `}</style>
        <div className='container flex itemsCenter justifyCenter bgWhite90'>

          {this.plans.map((plan, i) => {
            return (
              <PricingColumn
                plan={plan}
                isCurrentPlan={i === 1}
              />
            )
          })}

        </div>

      </PopupWrapper>
    )
  }

  private close = () => {
    this.props.router.goBack()
  }

}
