import * as React from 'react'

interface State {

}

interface Props {
  exceedsAllowedNodes?: boolean
  exceedsAllowedOperations?: boolean
  plan: string
}

export default class CurrentPlan extends React.Component<Props, State> {

  state = {}

  render() {

    const {exceedsAllowedNodes, exceedsAllowedOperations, plan} = this.props

    const planInfoBoxColors = exceedsAllowedNodes || exceedsAllowedOperations ? 'redTitle' : 'greenTitle'
    const actionButtonColor = exceedsAllowedNodes || exceedsAllowedOperations ? 'blue' : 'black50'

    return (
      <div className='container'>
        <style jsx={true}>{`

          .container {
            @p: .flex, .justifyBetween, .itemsCenter, .pa25, .br2;
          }

          .title {
            @p: .fw3, .f25;
          }

          .redTitle {
            @p: .red;
            background-color: rgba(242,92,84,.1);
          }

          .greenTitle {
            @p: .green, .bgLightgreen10;
          }

          .actionButton {
            @p: .pa10, .buttonShadow, .ttu, .f14, .fw6, .black50, .bgWhite, .pointer;
          }

        `}</style>
        {exceedsAllowedNodes || exceedsAllowedOperations &&
        <div>Plan exceeded</div>}
        <div className={`container ${planInfoBoxColors}`}>
          <div className={`title`}>{plan}</div>
          <div className={`actionButton ${actionButtonColor}`}>Upgrade Plan</div>
        </div>
      </div>
    )
  }
}
