import * as React from 'react'
import {Relation} from '../../types/types'
import {Icon} from 'graphcool-styles'

interface Props {
  relation?: Relation
}

export default class MutationsInfoBox extends React.Component<Props, {}> {

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .ba, .br2, .w100, .h100, .mb38;
            background-color: rgba(42,126,211,.04);
            border-color: rgba(42,126,211,.1);
          }

          .titleText {
            @inherit: .ml10, .blue, .f16;
            margin-top: -4px;
          }
        `}</style>
        <div className='flex pl16 pv16'>
          <Icon
            className='pointer'
            src={require('../../assets/icons/info_blue.svg')}
            width={19}
            height={19}
          />
          <div className='titleText'>
            Powered by the relation name, the following mutations can be used to mutate the relation:
          </div>
        </div>
      </div>
    )
  }
}
