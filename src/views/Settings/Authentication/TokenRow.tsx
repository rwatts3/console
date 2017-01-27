import * as React from 'react'
import {PermanentAuthToken} from '../../../types/types'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import {$p} from 'graphcool-styles'
import CopyToClipboard from 'react-copy-to-clipboard'
import * as cx from 'classnames'

interface Props {
  permanentAuthToken: PermanentAuthToken
  deleteSystemToken: (PermanentAuthToken) => void
}

interface State {
  copied: boolean
}

export default class TokenRow extends React.Component<Props, State> {

  state = {
    copied: false,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`

          .container {
            @inherit: .bb, .pb25, .mb25, .ph25;
            border-color: rgba( 229, 229, 229, 1);
          }

          .headerRow {
            @inherit: .flex, .itemsCenter;
          }

          .title {
            @inherit: .f14, .black40, .mh6;
          }

          .tokenRow {
            @inherit: .f25, .fw3, .mt10, .overflowXHidden, .nowrap;
          }

        `}</style>
        <div className='headerRow'>
          <Icon
            src={require('../../../assets/icons/lock.svg')}
            width={14}
            height={20}
          />
          <div className='title'>{this.props.permanentAuthToken.name}</div>
          <Icon
            className={$p.pointer}
            src={require('../../../assets/icons/trash.svg')}
            width={16}
            height={17}
            onClick={() => this.props.deleteSystemToken(this.props.permanentAuthToken)}
          />
        </div>
        <div className='flex'>
          <div className='relative f25 fw3 mt10 overflowXHidden nowrap'>
            {this.props.permanentAuthToken.token}
          </div>
          {/*<CopyToClipboard*/}
            {/*text={this.props.permanentAuthToken.token}*/}
            {/*onCopy={() => this.setState({copied: true} as State)}*/}
          {/*>*/}
            {/*<Icon*/}
              {/*className={cx($p.ml10, $p.pointer, $p.buttonShadow)}*/}
              {/*color={'rgba(0,0,0,.5)'}*/}
              {/*src={require('../../../assets/icons/copy.svg')}*/}
              {/*width={34}*/}
              {/*height={34}*/}
            {/*/>*/}
          {/*</CopyToClipboard>*/}
        </div>

      </div>
    )
  }

}
