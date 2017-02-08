import * as React from 'react'
import {PricingPlan} from '../../../types/types'

interface Props {
  plan: PricingPlan
}

export default class CreditCardInputSection extends React.Component<Props, {}> {

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @p: .bgBlack02, .bt;
            border-color: rgb(229,229,229);
            height: 400px;
          }
        `}</style>
      </div>
    )
  }
}
