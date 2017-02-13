import * as React from 'react'
import {PricingPlan} from '../../../types/types'
import PricingColumn from '../PricingColumn'
import CreditCardFront from './CreditCardFront'
import CreditCardBack from './CreditCardBack'
import {chunk} from '../../../utils/utils'
import {creditCardNumberValid, expirationDateValid, cpcValid} from '../../../utils/creditCardValidator'
import {Icon} from 'graphcool-styles'
import {ESCAPE_KEY, ENTER_KEY} from '../../../utils/constants'
import * as Relay from 'react-relay'
import SetCreditCardMutation from '../../../mutations/SetCreditCardMutation'

interface State {
  creditCardNumber: string
  cardHolderName: string
  expirationDate: string
  cpc: string

  creditCardDetailsValid: boolean
  displayAddressDataInput: boolean // false if credit card details still need to be provided

  addressLine1: string
  addressLine2: string
  zipCode: string
  state: string
  city: string
  country: string

  addressDataValid: boolean
}

interface Props {
  plan: PricingPlan
  projectId: string
  goBack?: Function
  setLoading?: Function
  close?: Function
}

export default class CreditCardInputSection extends React.Component<Props, State> {

  state = {
    creditCardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cpc: '',
    creditCardDetailsValid: false,
    displayAddressDataInput: false,

    addressLine1: '',
    addressLine2: '',
    zipCode: '',
    state: '',
    city: '',
    country: '',
    addressDataValid: false,
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
          onSelectPlan={this.props.goBack}
          isDisplayedInConfirmPlan={true}
        />

        {!this.state.displayAddressDataInput &&
        this.creditCardInput()}

        {!this.state.displayAddressDataInput &&
        this.moveToAddressInputButtons()}

        {this.state.displayAddressDataInput &&
        this.fullAddressDataInput()}

      </div>
    )
  }

  private fullAddressDataInput = (): JSX.Element => {
    return (
      <div className='flex flexColumn justifyBetween w100'>
        {this.addressDataInput()}
        {this.confirmButtons()}
      </div>
    )
  }

  private creditCardInput = (): JSX.Element => {
    return (
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
          onKeyDown={this.handleKeyDown}
        />
        <CreditCardBack
          className='absolute'
          cpc={this.state.cpc}
          didChangeCPC={this.onCPCChange}
          style={{left: '140px', top: '20px'}}
          onKeyDown={this.handleKeyDown}
        />
      </div>
    )
  }

  private addressDataInput = (): JSX.Element => {
    return (
      <div className='pl60 pt16'>
        <style jsx={true}>{`

          .title {
            @p: .ttu, .f12, .fw6, .black30, .mb10, .mt16, .nowrap;
          }

          .inputField {
            @p: .blue, .fw3, .f20, .bgTransparent;
          }

          .wideInput {
            width: 300px;
          }

          .narrowInput {
            width: 150px;
          }

        `}</style>
        <div className='title'>Address Line 1</div>
        <input
          className='inputField'
          value={this.state.addressLine1}
          placeholder='Enter address line 1'
          onChange={(e: any) => this.setState({addressLine1: e.target.value} as State, () =>
            this.validateAddressDetails())}
          type='text'
          onKeyDown={this.handleKeyDown}
          autoFocus={true}/>
        <div className='title'>Address Line 2</div>
        <input
          className='wideInput inputField'
          placeholder='Enter address line 2 (optional)'
          value={this.state.addressLine2}
          onChange={(e: any) => this.setState({addressLine2: e.target.value} as State, () =>
            this.validateAddressDetails())}
          onKeyDown={this.handleKeyDown}
          type='text'/>
        <div className='flex'>
          <div>
            <div className='title'>Zipcode</div>
            <input
              className='narrowInput inputField'
              placeholder='Enter zipcode'
              value={this.state.zipCode}
              onChange={(e: any) => this.setState({zipCode: e.target.value} as State, () =>
                this.validateAddressDetails())}
              type='text'/>
          </div>
          <div>
            <div className='title'>State</div>
            <input
              className='narrowInput inputField'
              placeholder='Enter state'
              value={this.state.state}
              onChange={(e: any) => this.setState({state: e.target.value} as State, () =>
                this.validateAddressDetails())}
              onKeyDown={this.handleKeyDown}
              type='text'/>
          </div>
        </div>
        <div className='flex'>
          <div>
            <div className='title'>City</div>
            <input
              className='narrowInput inputField'
              placeholder='Enter city'
              value={this.state.city}
              onChange={(e: any) => this.setState({city: e.target.value} as State, () =>
                this.validateAddressDetails())}
              onKeyDown={this.handleKeyDown}
              type='text'/>
          </div>
          <div>
            <div className='title'>Country</div>
            <input
              className='narrowInput inputField'
              placeholder='Enter country'
              value={this.state.country}
              onChange={(e: any) => this.setState({country: e.target.value} as State, () =>
                this.validateAddressDetails())}
              onKeyDown={this.handleKeyDown}
              type='text'/>
          </div>
        </div>
      </div>
    )
  }

  private moveToAddressInputButtons = () => {
    return (
      <div className='flex justifyEnd itemsEnd w100'>
        <div className='black50 mb25 mr38 pv10 pointer'>Cancel</div>
        <div
          className={`flex itemsCenter blue mr25 mb25 ph16 pv10 pointer ${!this.state.creditCardDetailsValid && 'o50'}`}
          onClick={() => {
            if (this.state.creditCardDetailsValid) {
              this.setState({displayAddressDataInput: true} as State)
            }
          }}
        >
          <div className='mr6'>Continue</div>
          <Icon
            src={require('../../../assets/icons/blue_arrow_left.svg')}
            rotate={180}
            width={17}
            height={12}
          />
        </div>
      </div>
    )
  }

  private confirmButtons = (): JSX.Element => {
    return (
      <div className='flex justifyEnd itemsEnd w100'>
        <style jsx={true}>{`
           .purchaseButton {
             @p: .white, .bgGreen, .br2, .buttonShadow, .mr25, .mb25, .ph16, .pv10, .pointer;
           }
        `}</style>
        <div
          className={`flex itemsCenter blue mr25 mb25 ph16 pv10 pointer`}
          onClick={() => {
            this.setState({displayAddressDataInput: false} as State)
          }}
        >
          <Icon
            src={require('../../../assets/icons/blue_arrow_left.svg')}
            width={17}
            height={12}
          />
          <div className='ml6 nowrap'>Credit card details</div>
        </div>

        <div
          className={`purchaseButton ${!this.state.addressDataValid && 'o50'}`}
          onClick={() => this.onConfirm()}
        >
          Purchase
        </div>
      </div>
    )
  }

  private updateExpirationDate = (newValue) => {
    if (newValue.length > 5) {
      return
    }
    this.setState({expirationDate: newValue} as State, () => this.validateCreditCardDetails())
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
    this.setState({creditCardNumber: newCreditCardNumber} as State, () => this.validateCreditCardDetails())
  }

  private onCardHolderNameChange = (newValue) => {
    this.setState({cardHolderName: newValue} as State, () => this.validateCreditCardDetails())

  }

  private onCPCChange = (newValue) => {
    if (newValue.length <= 3) {
      this.setState({cpc: newValue} as State, () => this.validateCreditCardDetails())
    }
  }

  private onConfirm = () => {

    const expirationDateComponents = this.state.expirationDate.split('/')
    const expirationMonth = expirationDateComponents[0]
    const expirationYear = expirationDateComponents[1]

    this.props.setLoading(true)

    if (this.state.creditCardDetailsValid && this.state.addressDataValid) {
      Stripe.card.createToken(
        {
          number: this.state.creditCardNumber,
          cvc: this.state.cpc,
          exp_month: expirationMonth,
          exp_year: expirationYear,
          name: this.state.cardHolderName,
          address_line1: this.state.addressLine1,
          address_line2: this.state.addressLine2,
          address_city: this.state.city,
          address_state: this.state.state,
          address_zip: this.state.zipCode,
          address_country: this.state.country,
        },
        this.stripeResponseHandler,
      )
    }

  }

  private stripeResponseHandler = (status, response) => {

    if (response.error) {
      console.error(response.error)
      this.props.setLoading(false)
      return
    }

    const token = response.id
    console.log('did receive token: ', token)

    Relay.Store.commitUpdate(
      new SetCreditCardMutation({
        projectId: this.props.projectId,
        token: token,
      }),
      {
        onSuccess: () => {
          // this.props.showNotification({message: 'Invite sent to: ' + email, level: 'success'})
          this.props.close()
        },
        onFailure: (transaction) => {
          // this.props.showNotification({message: transaction.getError().message, level: 'error'})
          console.error(transaction.getError().message)
          this.props.setLoading(false)
        },
      },
    )

  }

  private validateAddressDetails = () => {
    const addressLine1Valid = this.state.addressLine1.length > 0
    const zipcodeValid = this.state.zipCode.length > 0
    const stateValid = this.state.state.length > 0
    const cityValid = this.state.city.length > 0
    const countryValid = this.state.country.length > 0
    const addressValid = addressLine1Valid && zipcodeValid && stateValid && cityValid && countryValid

    if (addressValid) {
      this.setState({addressDataValid: true} as State)
    }
  }

  private validateCreditCardDetails = () => {
    const isCreditCardNumberValid = creditCardNumberValid(this.state.creditCardNumber)
    const isExpirationDateValid = expirationDateValid(this.state.expirationDate)
    const isCPCValid = cpcValid(this.state.cpc)
    if (isCreditCardNumberValid && isExpirationDateValid && isCPCValid) {
      this.setState({creditCardDetailsValid: true} as State)
    }
  }

  private handleKeyDown = (e) => {

    if (e.keyCode === ENTER_KEY) {
      if (!this.state.displayAddressDataInput) {
        if (this.state.creditCardDetailsValid) {
          this.setState({displayAddressDataInput: true} as State)
        }
      } else {
        if (this.state.addressDataValid) {
          this.onConfirm()
        }
      }
    } else if (e.keyCode === ESCAPE_KEY) {
      if (this.state.displayAddressDataInput) {
        this.setState({displayAddressDataInput: false} as State)
      }
    }
  }

}
