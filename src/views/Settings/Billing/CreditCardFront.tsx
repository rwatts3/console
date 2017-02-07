import * as React from 'react'
import {Icon} from 'graphcool-styles'

interface State {

}

interface Props {
  className?: string
  ownerName: string
  cardNumber: string
  validThrough: string
  isEditing: boolean
}

export default class CreditCardFront extends React.Component<Props, State> {

  render() {
    return (
      <div className={`container ${this.props.className || ''}`}>
        <style jsx={true}>{`

          .container {
            @p: .bgBlue, .ph16;
            border-radius: 5px;
            height: 220px;
            width: 350px;
          }

        `}</style>

        {this.topPart()}
        {this.bottomPart()}
      </div>
    )
  }

  private topPart = () => {
    return (

      !this.props.isEditing ?

        <div className='topNonEditing'>
          <style jsx={true}>{`
          .topNonEditing {
            @p: .flex, .pt16, .justifyBetween;
            height: 110px;
          }
        `}</style>
          <Icon
            className='pointer'
            src={require('../../../assets/icons/edit_credit_card.svg')}
            width={26}
            height={26}
          />
          <Icon
            src={require('../../../assets/icons/visa.svg')}
            width={62}
            height={20}
          />
        </div>

        :

        <div className='topEditing'>
          <style jsx={true}>{`
            .topEditing {
              @p: .pt25, .pr10, .flex, .justifyEnd;
              height: 110px;
            }

            .buttons {
              @p: .flex, .itemsCenter;
              height: 35px;
            }

          `}</style>
          <div className='buttons'>
            <Icon
              className='pointer'
              src={require('../../../assets/icons/cross_white.svg')}
              width={16}
              height={16}
            />
            <Icon
              className='pointer ml16'
              src={require('../../../assets/icons/confirm_white.svg')}
              width={35}
              height={35}
            />
          </div>
        </div>
    )
  }

  private bottomPart = () => {

    return (

      !this.props.isEditing ?

        <div className='bottomNonEditing'>
          <style jsx={true}>{`
            .bottomNonEditing {
              @p: .flex, .flexColumn, .ph10;
            }

            .creditCardFont {
              font-family: 'OCR A Std';
            }
          `}</style>
          <div className='f20 creditCardFont white'>{this.props.cardNumber}</div>
          <div className='flex justifyBetween mt16'>
            <div>
              <div className='f12 fw6 white30 ttu'>Card Holder</div>
              <div className='f16 white creditCardFont mt6'>{this.props.ownerName}</div>
            </div>
            <div>
              <div className='f12 fw6 white30 ttu'>Expires</div>
              <div className='f16 white creditCardFont mt6'>{this.props.validThrough}</div>
            </div>
          </div>
        </div>

        :

        <div className='bottomEditing'>
          <style jsx={true}>{`
            .bottomNonEditing {
              @p: .flex, .flexColumn, .ph10;
            }

            .creditCardFont {
              font-family: 'OCR A Std';
            }

            .inputField {
              @p: .ba, .bDashed, .bWhite30;
            }

          `}</style>
          <input
            className='f20 creditCardFont white'
            value={this.props.cardNumber}

          />
          <div className='flex justifyBetween mt16'>
            <div>
              <div className='f12 fw6 white30 ttu'>Card Holder</div>
              <div className='f16 white creditCardFont mt6'>{this.props.ownerName}</div>
            </div>
            <div>
              <div className='f12 fw6 white30 ttu'>Expires</div>
              <div className='f16 white creditCardFont mt6'>{this.props.validThrough}</div>
            </div>
          </div>
        </div>
    )

  }
}
