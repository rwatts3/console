import * as React from 'react'
import CreditCardFront from './CreditCardFront'
import CreditCardBack from './CreditCardBack'

interface State {
  isEditing: boolean
}

interface Props {
  creditCardNumber: string
  cardHolderName: string
  expirationDate: string
  cpc: string
  onCreditCardNumberChange: Function
  onCardHolderNameChange: Function
  onExpirationDateChange: Function
  onCPCChange: Function
}

export default class CreditCardInformation extends React.Component<Props, State> {

  payments = [
    {date: '2017/01/28', price: '$ 49.00'},
    {date: '2017/01/28', price: '$ 49.00'},
    {date: '2017/01/28', price: '$ 49.00'},
    {date: '2017/01/28', price: '$ 49.00'},
    {date: '2017/01/28', price: '$ 49.00'},
    {date: '2017/01/28', price: '$ 49.00'},
    {date: '2017/01/28', price: '$ 49.00'},
  ]

  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
    }
  }

  render() {
    return (
      <div className={`container ${this.state.isEditing ? 'bgWhite' : 'bgBlack04'}`}>
        <style jsx={true}>{`
          .container {
            @p: .ph60, .pt38, .pb96, .w100, .bt;
            border-color: rgba( 229, 229, 229, 1);
          }

          .title {
            @p: .mb38, .black30, .fw6, .f14, .ttu;
          }

        `}</style>

        {this.state.isEditing ?
          (
            <div>
              <div className='title'>Credit Card Information</div>
              {this.creditCardInEditingState()}
            </div>
          )
          :
          (<div className='flex'>
            <div>
              <div className='title'>Credit Card Information</div>
              {this.creditCardInNonEditingState()}
            </div>
            <div>
              <div className='title ml38'>Payment History</div>
              {this.paymentHistory()}
            </div>
          </div>)

        }

      </div>
    )
  }

  private paymentHistory = () => {
    return (
      <div className='ml38'>
        <style jsx={true}>{`

          .row {
            @p: .flex, .justifyBetween, .bb, .w100, .pt10, .pb16;
            border-color: rgba( 229, 229, 229, 1);
          }

          .date {
            @p: .f16, .black50;
          }

          .price {
            @p: .f16, .blue, .ml38;
          }

        `}</style>
        {this.payments.map((payment, i) => {
          return (
            <div key={i} className='row'>
              <div className='date'>{payment.date}</div>
              <div className='price'>{payment.price}</div>
            </div>
          )
        })}
      </div>
    )
  }

  private creditCardInNonEditingState = () => {

    return (
      <CreditCardFront
        cardHolderName={this.props.cardHolderName}
        creditCardNumber={this.props.creditCardNumber}
        expirationDate={this.props.expirationDate}
        isEditing={this.state.isEditing}
        setEditingState={this.setEditingState}
      />
    )

  }

  private creditCardInEditingState = () => {
    return (
      <div className='relative'>
        <CreditCardFront
          className='z1 absolute'
          cardHolderName={this.props.cardHolderName}
          creditCardNumber={this.props.creditCardNumber}
          expirationDate={this.props.expirationDate}
          isEditing={this.state.isEditing}
          setEditingState={this.setEditingState}
          onCreditCardNumberChange={this.props.onCreditCardNumberChange}
          onCardHolderNameChange={this.props.onCardHolderNameChange}
          onExpirationDateChange={this.props.onExpirationDateChange}
        />
        <CreditCardBack
          className='absolute'
          cpc={this.props.cpc}
          didChangeCPC={this.props.onCPCChange}
          style={{right: '75px', top: '20px'}}
          setEditingState={this.setEditingState}
        />
      </div>
    )
  }

  private setEditingState = (isEditing: boolean, saveChanges: boolean) => {
    this.setState({isEditing: isEditing} as State)
  }

}
