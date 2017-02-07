import * as React from 'react'
import * as Modal from 'react-modal'
import * as Relay from 'react-relay'
import {fieldModalStyle} from '../../../utils/modalStyle'
import {SearchProviderAlgolia} from '../../../types/types'
import UpdateSearchProviderAlgolia from '../../../mutations/UpdateSearchProviderAlgolia'
import FloatingInput from '../../../components/FloatingInput/FloatingInput'
import * as cx from 'classnames'
import {$p, $v, Icon} from 'graphcool-styles'

interface Props {
  apiKey: string
  applicationId: string
  onChangeApiKey: Function
  onChangeApplicationId: Function
  onRequestClose: () => void
  onSave: () => void
}

export default class AlgoliaModal extends React.Component<Props, null> {
  render() {
    const {apiKey, applicationId, onChangeApiKey, onChangeApplicationId, onRequestClose, onSave} = this.props

    return (
      <Modal
        isOpen={true}
        onRequestClose={onRequestClose}
        contentLabel='Algolia Settings'
        style={fieldModalStyle}
      >
        <style jsx={true} global>{`
          .algolia-modal .input {
            background: none;
          }
        `}</style>
        <style jsx={true}>{`
          .algolia-modal {
            @p: .bgWhite;
          }
          .header {
            @p: .pb25;
            background: #EEF7F0;
            border-bottom: 1px solid #D8F0DC;
          }
          .logo {
            @p: .mt25, .ml25;
            width: 75px;
          }

          .close {
            @p: .absolute, .pointer;
            top: 23px;
            right: 24px;
          }
          .button {
            @p: .pointer;
            padding: 9px 16px 10px 16px;
          }
          .save {
            @p: .bgWhite10, .white30, .br2;
          }
          .save.active {
            @p: .bgGreen, .white;
          }
          .inputs {
            @p: .pa25;
          }
          .bottom {
            @p: .flex, .itemsCenter, .justifyBetween, .pa16, .bt, .bBlack10;
          }
          .inputs, .bottom {
            @p: .bgBlack04;
          }
          .cancel {
            @p: .white50, .f16;
          }
          .intro {
            @p: .flex, .justifyCenter, .w100, .h100, .pa38, .itemsStart;
            h1, h2 {
              @p: .tc;
            }
            h1 {
              @p: .f25, .fw3;
            }
            h2 {
              @p: .black40, .f14, .mt25, .fw4;
            }
          }
          .inner-intro {
            @p: .flex, .justifyCenter, .itemsCenter, .flexColumn, .mt16;
          }
        `}</style>
        <div className='algolia-modal'>
          <div className='header'>
            <img className='logo' src={require('assets/graphics/algolia-logo.svg')} alt=''/>
            <div
              className='close'
              onClick={onRequestClose}
            >
              <Icon
                src={require('graphcool-styles/icons/stroke/cross.svg')}
                stroke
                strokeWidth={2}
                color={$v.gray40}
                width={26}
                height={26}
              />
            </div>
          </div>
          {(applicationId.length === 0 || apiKey.length === 0) && (
            <div className='intro'>
              <div className='inner-intro'>
                <h1>Welcome to the Algolia Integration</h1>
                <h2>Before Algolia can index your graphcool data, you must create an API Key in Algolia.</h2>
                <a
                  className='button green'
                  href='https://graph.cool/docs/tutorials/algolia-auto-syncing-for-graphql-backends-aroozee9zu'
                  target='_blank'
                >
                  How to create an API Key
                </a>
              </div>
            </div>
          )}
          <div className='inputs'>
            <FloatingInput
              labelClassName={cx($p.f16, $p.pa16, $p.black50, $p.fw3)}
              className={cx($p.pa16, $p.br2, $p.bn, $p.mb10, $p.f25, $p.fw3, 'input')}
              label='Application Id'
              placeholder='xxxxxxxxxxxxx'
              value={applicationId || ''}
              onChange={onChangeApplicationId}
            />
            <FloatingInput
              labelClassName={cx($p.f16, $p.pa16, $p.black50, $p.fw3)}
              className={cx($p.pa16, $p.br2, $p.bn, $p.mb10, $p.f25, $p.fw3, 'input')}
              label='API Key'
              placeholder='xxxxxxxxxxxxx'
              value={apiKey || ''}
              onChange={onChangeApiKey}
            />
          </div>
          <div className='bottom'>
            <div className='button cancel' onClick={onRequestClose}>Cancel</div>
            <div className='button save active' onClick={onSave}>Save</div>
          </div>
        </div>
      </Modal>
    )
  }

}
