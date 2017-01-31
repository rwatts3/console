import * as React from 'react'
import {$v, Icon} from 'graphcool-styles'
import {Relation, Model, Cardinality} from '../../types/types'
import {lowercaseFirstLetter} from '../../utils/utils'

interface Props {
  leftModel?: Model
  rightModel?: Model
  cardinality?: Cardinality
  fieldOnLeftModelName: string
  fieldOnRightModelName: string
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
              className={`pointer ${(!this.props.leftModel || !this.props.rightModel) && 'o0'}`}
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
            {this.generateFirstInfoSentence()}
            {this.generateSecondInfoSentence()}
            {this.generateThirdInfoSentence()}
          </div>
        )
  }

  private generateFirstInfoSentence = (): JSX.Element => {
    const {cardinality, leftModel, rightModel} = this.props
    const firstCardinality = cardinality.startsWith('ONE') ? 'One' : 'Many'
    const isOrAre = firstCardinality === 'Many' ? 'are' : 'is'
    const secondCardinality = cardinality.endsWith('ONE') ? 'one' : 'many'
    const firstModel = cardinality.startsWith('ONE') ? leftModel.name : leftModel.namePlural
    const secondModel = cardinality.endsWith('ONE') ? rightModel.name : rightModel.namePlural
    return (
      <div className='infoLine'>
        <style jsx={true}>{`
          .infoLine {
            @inherit: .pv4, .f16, .black50, .nowrap;
          }
        `}</style>
        <span className='green fw6'>{firstCardinality + ' '}</span>
        <span className='blue fw6'>{firstModel + ' '}</span>
        <span>{isOrAre} related to </span>
        <span className='green fw6'>{secondCardinality + ' '}</span>
        <span className='blue fw6'>{secondModel }</span>
      </div>
    )
  }

  private generateSecondInfoSentence = (): JSX.Element => {
    const {cardinality, leftModel, rightModel} = this.props
    const firstModelName = leftModel.name + '\'s'
    const oneOrMany = cardinality.endsWith('MANY') ? 'many' : 'one'
    const secondModelName = cardinality.endsWith('MANY') ? rightModel.namePlural : rightModel.name
    return (
      <div className='infoLine'>
        <style jsx={true}>{`
          .infoLine {
            @inherit: .pv4, .f16, .black50, .nowrap;
          }
          .purpleColor {
            color: rgba(164,3,111,1);
          }

        `}</style>
        <span className='blue fw6'>{firstModelName + ' '}</span>
        <span>field</span>
        <span className='purpleColor fw6'>{' ' + this.props.fieldOnLeftModelName + ' '}</span>
        <span>represents</span>
        <span className='green fw6'>{' ' + oneOrMany + ' '}</span>
        <span className='blue fw6'>{secondModelName}</span>
      </div>
    )
  }

  private generateThirdInfoSentence = (): JSX.Element => {
    const {cardinality, leftModel, rightModel} = this.props
    const firstModelName = rightModel.name + '\'s'
    const oneOrMany = cardinality.startsWith('MANY') ? 'many' : 'one'
    const secondModelName = cardinality.startsWith('MANY') ? leftModel.namePlural : leftModel.name
    return (
      <div className='infoLine'>
        <style jsx={true}>{`
          .infoLine {
            @inherit: .pv4, .f16, .black50, .nowrap;
          }
          .purpleColor {
            color: rgba(164,3,111,1);
          }

        `}</style>
        <span className='blue fw6'>{firstModelName + ' '}</span>
        <span>field</span>
        <span className='purpleColor fw6'>{' ' + this.props.fieldOnRightModelName + ' '}</span>
        <span>represents</span>
        <span className='green fw6'>{' ' + oneOrMany + ' '}</span>
        <span className='blue fw6'>{secondModelName}</span>
      </div>
    )
  }


}
