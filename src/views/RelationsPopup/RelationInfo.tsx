import * as React from 'react'
import {$v, Icon} from 'graphcool-styles'
import {Relation} from '../../types/types'

interface Props {
  relation?: Relation
}

interface State {
  expanded: boolean
}

export default class RelationInfo extends React.Component<Props, State> {

  state = {
    expanded: false,
  }

  render() {
    return !this.state.expanded ?
        (
          <div className='flex justifyEnd pr16 pb16 mt10 h100'>
            <div
              className='pointer'
              onClick={() => this.setState({expanded: true})}
            >
              <Icon
                src={require('../../assets/icons/info_blue.svg')}
                width={29}
                height={29}
              />
            </div>
          </div>
        )
      :
        (
          <div className='container'>
            <style jsx={true}>{`
              .container {
                @inherit: .bgWhite, .mt25, .pr25, .pt25, .pl38, .pb38, .bt, .bBlack10;
              }

              .infoLine {
                @inherit: .pv4, .f16, .black50;
              }
            `}</style>
            <div className='flex justifyEnd'>
              <div
                className='pointer'
                onClick={() => this.setState({expanded: false})}
              >
                <Icon
                  src={require('graphcool-styles/icons/fill/triangle.svg')}
                  color={$v.gray30}
                  width={18}
                  height={12}
                  rotate={-90}
                />
              </div>
            </div>
            <div className='infoLine'>One Movie is related to many Theatres</div>
            <div className='infoLine'>One Movie is related to many Theatres</div>
            <div className='infoLine'>One Movie is related to many Theatres</div>
          </div>
        )
  }
}
