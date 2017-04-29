import * as React from 'react'
import {$v, Icon} from 'graphcool-styles'

interface Props {

  enums: string[]
  onChange: (enums: string[]) => void
}

interface State {
  addingEnum: boolean
  enumValue: string
}

export default class EnumEditor extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      addingEnum: false,
      enumValue: '',
    }
  }

  render() {
    const {enums, onChange} = this.props
    const {addingEnum, enumValue} = this.state

    return (
      <div className='enum-editor'>
        <style jsx={true}>{`
        .enum-editor {
          @p: .flex, .itemsCenter;
        }
        .value {
          @p: .br2, .pv6, .ph10, .mr6, .black60, .fw6, .f14, .bgBlack10, .pointer;
        }
        .value:hover {
          @p: .bgBlack20, .black70;
        }
        .plus {
          @p: .bgBlue20, .flex, .itemsCenter, .justifyCenter, .br100, .ml10, .pointer;
          height: 26px;
          width: 26px;
        }
        input {
          @p: .f14, .blue;
        }
      `}</style>
        {enums.map(enumValue => (
          <div className='value'>{enumValue}</div>
        ))}
        {addingEnum && (
          <input
            type='text'
            autoFocus
            value={enumValue}
            onChange={this.handleChangeEnumValue}
            placeholder='Add an enum value'
            onKeyDown={this.keyDown}
          />
        )}
        <div className='plus' onClick={this.addEnum}>
          <Icon
            src={require('graphcool-styles/icons/stroke/add.svg')}
            width={20}
            height={20}
            color={$v.blue}
            stroke
            strokeWidth={3}
          />
        </div>
      </div>
    )
  }

  private handleChangeEnumValue = (e) => {
    this.setState({enumValue: e.target.value} as State)
  }

  private addEnum = () => {
    if (this.state.addingEnum) {
      this.submitCurrentValue()
    } else {
      this.setState({addingEnum: true} as State)
    }
  }

  private keyDown = e => {
    if (e.keyCode === 13) {
      this.submitCurrentValue()
    }
  }

  private submitCurrentValue() {
    this.props.onChange(this.props.enums.concat(this.state.enumValue))
    this.setState({enumValue: ''} as State)
  }
}
