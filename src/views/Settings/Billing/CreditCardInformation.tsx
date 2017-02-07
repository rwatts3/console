import * as React from 'react'
import CreditCardFront from './CreditCardFront'
import CreditCardBack from './CreditCardBack'

interface State {
  isEditing: boolean
}

interface Props {
  ownerName: string
  cardNumber: string
  validThrough: string
}

export default class CreditCardInformation extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      isEditing: true,
    }
  }

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @p: .ph60, .pt38, .w100, .bt, .bgBlack04;
            border-color: rgba( 229, 229, 229, 1);
          }
        `}</style>
        {!this.state.isEditing && <CreditCardFront
          ownerName='Nikolas Burk'
          cardNumber='XXXX XXXX XXXX 8345'
          validThrough='07/21'
          isEditing={this.state.isEditing}
        />}

        {this.state.isEditing &&
        <div className='relative'>
          <CreditCardFront
            className='z1 absolute'
            ownerName='Nikolas Burk'
            cardNumber='XXXX XXXX XXXX 8345'
            validThrough='07/21'
            isEditing={this.state.isEditing}
          />
          <CreditCardBack
            className='absolute'
            cpc='123'
            didChangeCPC={(cpc) => console.log(cpc)}
            style={{right: '0px', top: '20px'}}
          />
        </div>}

      </div>
    )
  }
}
