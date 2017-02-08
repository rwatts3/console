import * as React from 'react'
import {PricingPlan} from '../../../types/types'
import PricingColumn from '../PricingColumn'
import CreditCardFront from './CreditCardFront'
import CreditCardBack from './CreditCardBack'
import {chunk} from '../../../utils/utils'

interface State {
  creditCardNumber: string
  cardHolderName: string
  expirationDate: string
  cpc: string
}

interface Props {
  plan: PricingPlan
}

export default class CreditCardInputSection extends React.Component<Props, State> {

  state = {
    creditCardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cpc: '',
  }

  render() {
    Stripe.setPublishableKey('pk_test_BpvAdppmXbqmkv8NQUqHRplE')
    return (
      <div className='creditCardInputSectionContainer'>
        <style global jsx={true}>{`

          .creditCardInputSectionContainer {
            @p: .flex, .bgBlack02, .w100, .bt;
            border-color: rgb(229,229,229);
            height: 400px;
          }

          .pricingColumnMargin {
            margin-top: -15px;
          }

          .creditCardInputContainer {
            left: 60px;
            top: 45px;
          }

        `}</style>

        <PricingColumn
          className='pricingColumnMargin ml38 buttonShadow'
          plan='Growth'
          isCurrentPlan={false}
          isSelected={true}
        />

        <div className='relative creditCardInputContainer'>
          <CreditCardFront
            className='z1 absolute'
            cardHolderName={this.state.cardHolderName}
            creditCardNumber={this.state.creditCardNumber}
            expirationDate={this.state.expirationDate}
            isEditing={true}
            onCreditCardNumberChange={this.updateCreditCardNumber}
            onCardHolderNameChange={this.onCardHolderNameChange}
            onExpirationDateChange={this.updateExpirationDate}
            shouldDisplayVisaLogo={true}
          />
          <CreditCardBack
            className='absolute'
            cpc={this.state.cpc}
            didChangeCPC={this.onCPCChange}
            style={{left: '140px', top: '20px'}}
          />
        </div>

        <div className='flex justifyEnd itemsEnd w100'>
          <div className='black50 mb25 mr38 pv10 pointer'>Cancel</div>
          <div
            className='white bgGreen br2 buttonShadow mr25 mb25 ph16 pv10 pointer'
            onClick={() => this.onConfirm()}
          >
            Purchase
          </div>
        </div>

      </div>
    )
  }

  private updateExpirationDate = (newValue) => {
    if (newValue.length > 5) {
      return
    }
    this.setState({expirationDate: newValue} as State)

    // let newExpirationDate
    // let expirationDateWithoutSlash = newValue.replace('/', '')
    // console.log('expirationDateWithoutSlash', expirationDateWithoutSlash)
    // if (expirationDateWithoutSlash.length <= 2) {
    //   newExpirationDate = newValue + '/'
    //   this.setState({newExpirationDate: newExpirationDate} as State)
    // } else {
    //   this.setState({newExpirationDate: newValue} as State)
    // }
  }

  private updateCreditCardNumber = (newValue) => {

    // pasting
    if (newValue.length > 4 && !newValue.includes(' ')) {
      const chunks = chunk(newValue, 4, true)
      const newCreditCardNumber = chunks.join(' ')
      this.setState({creditCardNumber: newCreditCardNumber} as State)
      return
    }

    // regular typing
    let creditCardComponents = newValue.split(' ')
    const lastComponent = creditCardComponents[creditCardComponents.length - 1]

    if (newValue.length >= 20) {
      return
    }

    let newLastComponent
    if (creditCardComponents.length < 4 && lastComponent.length === 4) {
      newLastComponent = lastComponent + ' '
    } else {
      newLastComponent = lastComponent
    }

    creditCardComponents[creditCardComponents.length - 1] = newLastComponent
    const newCreditCardNumber = creditCardComponents.join(' ')
    this.setState({creditCardNumber: newCreditCardNumber} as State)
  }

  private onCardHolderNameChange = (newValue) => {
    this.setState({cardHolderName: newValue} as State)
  }

  private onCPCChange = (newValue) => {
    this.setState({cpc: newValue} as State)
  }

  private onConfirm = () => {
    const expirationDateComponents = this.state.expirationDate.split('/')
    const expirationMonth = expirationDateComponents[0]
    const expirationYear = expirationDateComponents[1]

    Stripe.card.createToken(
      {
      number: this.state.creditCardNumber,
      cvc: this.state.cpc,
      exp_month: expirationMonth,
      exp_year: expirationYear,
      address_zip: '22305',
    },
      this.stripeResponseHandler
    )
  }

  private stripeResponseHandler = (status, response) => {

    if (response.error) {
      console.error(response.error)
      return
    }

    const token = response.id
    console.log('did receive token: ', token)
  }

}
