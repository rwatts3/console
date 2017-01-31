import * as React from 'react'
import {Model} from '../../types/types'
import {Combobox} from 'react-input-enhancements'
import {$v} from 'graphcool-styles'
import HorizontalSelect from './HorizontalSelect'
import FieldNameInput from './FieldNameInput'

interface State {
  selectedIndex: number
}

interface Props {
  relatedFieldName: string | null
  relatedFieldType: string | null
  many: boolean
  models: Model[]
  selectedModel?: Model
  didSelectedModel: Function
}

export default class ModelSelectionBox extends React.Component<Props, State> {

  state = {
    selectedIndex: 0,
  }

  render() {

    const modelNames = this.props.models.map(model => model.name)

    return (
      <div className='container'>
        <style jsx={true}>{`

          .container {
            @inherit: .buttonShadow;
          }

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
              />}}
          </Combobox>
        </div>
        <FieldNameInput
          relatedFieldName={this.props.relatedFieldName}
          relatedFieldType={this.props.relatedFieldType}
        />
      </div>
    )
  }

  private didChangeTab = (index: number, choice: string) => {
    console.log(index, choice)
    this.setState({selectedIndex: index} as State)
  }

  private didSelectModelWithName = (modelName: string) => {
    const model = this.props.models.find((model) => model.name === modelName)
    // this.setState({model: model})
    // console.log('did select: ', model)
    this.props.didSelectedModel(model)
  }

}
