import * as React from 'react'

interface Props {
  className?: string
  style?: any
  cpc: string
  didChangeCPC: Function
}

export default class CreditCardBack extends React.Component<Props, {}> {

  render() {
    return (
      <div className={`container ${this.props.className || ''}`} style={this.props.style}>
        <style jsx={true}>{`

          .container {
            @p: .flex, .flexColumn;
            background-color: rgba(29,96,164,1);
            border-radius: 5px;
            height: 220px;
            width: 350px;
          }

          .inputField {
            @p: .ph10, .pv6, .f16, .tc, .br2, .ml10, .mr38;
            width: 46px;
            height: 35px;
          }

          .top {
            @p: .bgBlack, .mv38;
            height: 50px;
          }

        `}</style>
        <div className='top' />
        <div className='flex justifyEnd itemsCenter'>
          <div className='f12 fw6 white30 ttu'>CPC</div>
          <input
            className='inputField'
            type="text"
            value={this.props.cpc}
            onChange={(e) => this.props.didChangeCPC(e.target.value)}
          />
        </div>
      </div>
    )
  }
}
