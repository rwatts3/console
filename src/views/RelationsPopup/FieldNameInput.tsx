import * as React from 'react'
import {Icon} from 'graphcool-styles'
import {validateFieldName} from '../../utils/nameValidator'

interface State {
  isHovered: boolean
  isEnteringFieldName: boolean
  originalFieldName: string
}

interface Props {
  relatedFieldName: string | null
  relatedFieldType: string | null
  didChangeFieldName: (newFieldName: string) => void
  forbiddenFieldNames: string[]
}

export default class FieldNameInput extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      isHovered: false,
      isEnteringFieldName: false,
      originalFieldName: props.relatedFieldName
    }
  }


  render() {

    const invalidInputMessage: string | null = this.generateInvalidInputMessage(this.props.relatedFieldName)

    let relatedFieldElement: JSX.Element
    if (this.props.relatedFieldName !== null && this.props.relatedFieldType) {
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
                ${Boolean(invalidInputMessage) ? ' red' : ' purpleColor'}`}
                onKeyDown={this.handleKeyDown}
                value={this.props.relatedFieldName}
                onChange={(e: any) => this.props.didChangeFieldName(e.target.value)}
              />
              {Boolean(invalidInputMessage) &&
              <div
                className='red f12'
              >
                {invalidInputMessage}
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
    const {relatedFieldName} = this.props
    const {originalFieldName} = this.state
    const actualRelatedFieldName = relatedFieldName.length === 0 ? originalFieldName : relatedFieldName
    this.props.didChangeFieldName(actualRelatedFieldName)

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

  private generateInvalidInputMessage = (input: string): string | null => {
    if (input.length === 0) {
      return null
    }

    if (!validateFieldName(input)) {
      return 'Field names have to start with a lowercase letter and must only contain alphanumeric characters.'
    }

    if (this.props.forbiddenFieldNames.includes(input)) {
      return 'Field with name \'' + input + '\' already exists in this project.'
    }

    return null
  }
}
