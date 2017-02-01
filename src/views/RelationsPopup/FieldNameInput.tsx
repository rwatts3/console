import * as React from 'react'
import {Icon} from 'graphcool-styles'
import {validateFieldName} from '../../utils/nameValidator'

interface State {
  isHovered: boolean
  isEnteringFieldName: boolean
}

interface Props {
  relatedFieldName: string | null
  relatedFieldType: string | null
  didChangeFieldName: (newFieldName: string) => void
}

export default class FieldNameInput extends React.Component<Props, State> {

  state = {
    isHovered: false,
    isEnteringFieldName: false,
  }

  render() {

    let relatedFieldElement: JSX.Element
    if (this.props.relatedFieldName && this.props.relatedFieldType) {
      relatedFieldElement = (
        <div className={`flex itemsCenter ph16 pv8
          ${this.state.isHovered && ' bgBlack02'}
          ${this.state.isEnteringFieldName && ' justifyBetween'}`
        }
        >
          <style jsx={true}>{`

            .fieldType {
              @inherit: .f14, .ml6, .pv4, .ph6, .black50, .bgBlack04, .br2;
              font-family: 'Source Code Pro';
            }

            .purpleColor {
              color: rgba(164,3,111,1);
            }

            .move {
              transition: .25s linear all;
            }

          `}</style>
          {!this.state.isEnteringFieldName && !this.state.isHovered &&
          (<div className='f20 purpleColor'>{this.props.relatedFieldName}</div>
          )}
          {!this.state.isEnteringFieldName && this.state.isHovered &&
          (<div className='flex itemsCenter '>
              <div className='f20 purpleColor'>{this.props.relatedFieldName}</div>
              <Icon
                className='mh4 move'
                src={require('../../assets/icons/edit_project_name.svg')}
                width={16}
                height={16}
              />
            </div>
          )}
          {this.state.isEnteringFieldName &&
          (
            <div>
              <input
                type='text'
                autoFocus={true}
                className={`f20 bgTransparent wS96
                ${this.inputValid(this.props.relatedFieldName) ? ' purpleColor' : ' red'}`}
                onKeyDown={this.handleKeyDown}
                value={this.props.relatedFieldName}
                onChange={(e: any) => this.props.didChangeFieldName(e.target.value)}
              />
              {!this.inputValid(this.props.relatedFieldName) &&
              <div
                className='red f12'
              >
                Field names have to start with a lowercase letter and must only contain alphanumeric characters.
              </div>}
            </div>
          )}
          <div className='fieldType'>{this.props.relatedFieldType}</div>
        </div>
      )
    } else {
      relatedFieldElement = (
        <div className='ph16 pv8 black20 f20 i'>will be generated</div>
      )
    }

    return (
      <div
        className='bgWhite pointer'
        onMouseEnter={() => this.setState({isHovered: true} as State)}
        onMouseLeave={() => this.setState({isHovered: false} as State)}
        onClick={() => this.setState({isEnteringFieldName: true} as State)}
      >
        <div className='black40 f14 pl16 pv8'>related field:</div>
        {relatedFieldElement}
      </div>
    )
  }

  private handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.setState({
        isEnteringFieldName: false,
      } as State)
    } else if (e.keyCode === 27) {
      this.setState({
        isEnteringFieldName: false,
      } as State)
    }
  }

  private inputValid = (input: string) => {
    return input.length > 0 && validateFieldName(input)
  }
}
