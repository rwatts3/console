import * as React from 'react'
import CurrentPlan from './CurrentPlan'
import Usage from './Usage'
import CreditCardInformation from './CreditCardInformation'

interface State {

}

interface Props {

}

export default class Billing extends React.Component<Props, State> {

  state = {}

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`

          .container {
            @p: .br, .ph38, .pt38;
            max-width: 700px;
            border-color: rgba( 229, 229, 229, 1);
          }

        `}</style>
        <CurrentPlan plan='Developer' />
        <Usage />
        <CreditCardInformation
          ownerName='Nikolas Burk'
          cardNumber='XXXX XXXX XXXX 8345'
          validThrough='07/21'
        />
      </div>
    )
  }

}
