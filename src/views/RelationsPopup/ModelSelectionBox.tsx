import * as React from 'react'
import {Model} from '../../types/types'
import {Combobox} from 'react-input-enhancements'
import {$v} from 'graphcool-styles'
import HorizontalSelect from './HorizontalSelect'
import FieldNameInput from './FieldNameInput'
import BreakingChangeIndicator from './BreakingChangeIndicator'

interface Props {
  relatedFieldName: string | null
  relatedFieldType: string | null
  many: boolean
  models: Model[]
  selectedModel?: Model
  didSelectedModel: Function
  didChangeFieldName: (newFieldName: string) => void
  inputIsBreakingChange: boolean
  modelIsBreakingChange: boolean
  // messagesForBreakingChange: string[]
}

export default class ModelSelectionBox extends React.Component<Props, {}> {

  render() {

    const modelNames = this.props.models.map(model => model.name)

    let tops: number[] = []
    let plain: boolean[] = []
    if (this.props.inputIsBreakingChange) {
      tops.push(80)
      plain.push(true)
    }
    if (this.props.modelIsBreakingChange) {
      tops.push(16)
      plain.push(true)
    }

    // const messageElementsForBreakingChange: JSX.Element[] = this.props.messagesForBreakingChange.map(message =>
    //   <span>{message}</span>
    // )

    return (
      <BreakingChangeIndicator
        className='buttonShadow'
        width={16}
        height={12}
        tops={tops}
        plain={plain}
      >
        <style jsx={true}>{`

          .titleText {
            @inherit: .f25, .fw6;
          }

        `}</style>
        <div className={`flex itemsCenter justifyBetween pv8 ph16 ${this.props.selectedModel ? 'bgBlue' : 'bgBlue20'}`}>
          <Combobox
            value=''
            options={modelNames}
            onSelect={(value) => this.didSelectModelWithName(value)}
          >
            {inputProps => {
              {/*console.log('input props', inputProps)*/}
              return <input
                type='text'
                value={this.props.selectedModel ? this.props.selectedModel.name : 'Select Model'}
                className={`titleText bgTransparent ${this.props.selectedModel ? 'white' : 'blue'}`}
                style={{width: '180px'}}
              />
            }}
          </Combobox>
        </div>
        <FieldNameInput
          relatedFieldName={this.props.relatedFieldName}
          relatedFieldType={this.props.relatedFieldType}
          didChangeFieldName={this.props.didChangeFieldName}
        />
      </BreakingChangeIndicator>
    )
  }

  private didSelectModelWithName = (modelName: string) => {
    const model = this.props.models.find((model) => model.name === modelName)
    this.props.didSelectedModel(model)
  }

}
