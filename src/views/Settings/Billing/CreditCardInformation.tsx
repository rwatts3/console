import * as React from 'react'
import CreditCardFront from './CreditCardFront'
import CreditCardBack from './CreditCardBack'

interface State {
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
  isEditing: boolean
  setEditingState: Function
}

export default class CreditCardInformation extends React.Component<Props, State> {

  payments = [
    {date: '2017/01/28', price: '$ 49.00'},
  ]

  render() {
    return (
      <div className={`container ${this.props.isEditing ? 'bgWhite' : 'bgBlack04'}`}>
        <style jsx={true}>{`

          .container {
            @p: .ph60, .pt38, .pb96, .w100, .bt;
            border-color: rgba( 229, 229, 229, 1);
          }

          .title {
            @p: .mb38, .black30, .fw6, .f14, .ttu;
          }

          .editingContainer {
            padding-bottom: 110px;
          }

        `}</style>

        {this.props.isEditing ?
          (
            <div className='editingContainer'>
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
        isEditing={this.props.isEditing}
        setEditingState={this.props.setEditingState}
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
          isEditing={this.props.isEditing}
          setEditingState={this.props.setEditingState}
          onCreditCardNumberChange={this.props.onCreditCardNumberChange}
          onCardHolderNameChange={this.props.onCardHolderNameChange}
          onExpirationDateChange={this.props.onExpirationDateChange}
        />
        <CreditCardBack
          className='absolute'
          cpc={this.props.cpc}
          didChangeCPC={this.props.onCPCChange}
          style={{right: '75px', top: '20px'}}
          setEditingState={this.props.setEditingState}
        />
      </div>
    )
  }

}
