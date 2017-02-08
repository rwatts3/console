import * as React from 'react'
import CurrentPlan from './CurrentPlan'
import Usage from './Usage'
import CreditCardInformation from './CreditCardInformation'
import {chunk} from '../../../utils/utils'

interface State {
  newCreditCardNumber: string
  newCardHolderName: string
  newExpirationDate: string
  newCPC: string
}

interface Props {
  creditCardNumber: string
  cardHolderName: string
  expirationDate: string
  cpc: string
  children: JSX.Element
}

export default class Billing extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      // newCreditCardNumber: props.creditCardNumber,
      // newCardHolderName: props.cardHolderName,
      // newExpirationDate: props.expirationDate,
      // newCPC: props.cpc,
      newCreditCardNumber: 'XXXX XXXX XXXX 8345',
      newCardHolderName: 'Nikolas Burk',
      newExpirationDate: '07/21',
      newCPC: '123',
    }
  }

  render() {
    return (

      <div className='container'>
        <style jsx={true}>{`

          .container {
            @p: .br;
            max-width: 700px;
            border-color: rgba( 229, 229, 229, 1);
          }

        `}</style>
        <CurrentPlan plan='Developer' />
        <Usage />
        <CreditCardInformation
          creditCardNumber={this.state.newCreditCardNumber}
          cardHolderName={this.state.newCardHolderName}
          expirationDate={this.state.newExpirationDate}
          cpc={this.state.newCPC}
          onCreditCardNumberChange={this.updateCreditCardNumber}
          onCardHolderNameChange={(newValue) => this.setState({newCardHolderName: newValue} as State)}
          onExpirationDateChange={this.updateExpirationDate}
          onCPCChange={(newValue) => {
            let newCPC
            if (newValue.length > 3) {
              newCPC = newValue.substr(0, 3)
            } else {
              newCPC = newValue
            }
            this.setState({newCPC: newCPC} as State)
          }}
        />
        {this.props.children}
      </div>
    )
  }

  private updateExpirationDate = (newValue) => {
    if (newValue.length > 5) {
      return
    }
    this.setState({newExpirationDate: newValue} as State)

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
      this.setState({newCreditCardNumber: newCreditCardNumber} as State)
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
    this.setState({newCreditCardNumber: newCreditCardNumber} as State)
  }

}
