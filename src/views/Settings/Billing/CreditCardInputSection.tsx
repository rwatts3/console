import * as React from 'react'
import {PricingPlan} from '../../../types/types'
import PricingColumn from '../PricingColumn'

interface Props {
  plan: PricingPlan
}

export default class CreditCardInputSection extends React.Component<Props, {}> {

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @p: .bgBlack02, .w100, .bt;
            border-color: rgb(229,229,229);
            height: 400px;
          }

          .pricingColumn {
            margin-top: -15px;
          }

        `}</style>

        <PricingColumn
          className='ml38'
          plan='Developer'
          isCurrentPlan={false}
        />

      </div>
    )
  }
}
