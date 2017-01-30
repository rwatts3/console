import * as React from 'react'
import {Model} from '../../types/types'
import {Combobox} from 'react-input-enhancements'
import {$v} from 'graphcool-styles'

interface Props {
  relatedFieldName: string | null
  relatedFieldType: string | null
  many: boolean
  models: Model[]
  selectedModel?: Model
  didSelectedModel: Function
}

export default class ModelSelectionBox extends React.Component<Props, {}> {

  render() {

    const modelNames = this.props.models.map(model => model.name)

    let relatedFieldElement: JSX.Element
    if (this.props.relatedFieldName && this.props.relatedFieldType) {
      relatedFieldElement = (
        <div className='flex itemsCenter'>
          <style jsx={true}>{`

            .fieldType {
              @inherit: .f14, .ml6, .pv4, .ph6, .black50, .bgBlack04;
              font-family: 'Source Code Pro';
            }

            .purpleColor {
              color: rgba(164,3,111,1);
            }

          `}</style>
          <div className='f20 purpleColor'>{this.props.relatedFieldName}</div>
          <div className='fieldType'>{this.props.relatedFieldType}</div>
        </div>
      )
    } else {
      relatedFieldElement = (
        <div className=' pv8 black20 f20 i'>will be generated</div>
      )
    }

    return (
      <div className='container buttonShadow'>
        <style jsx={true}>{`

          .container {
            width: 200px;
            height: 131px;
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
        <div className='ph16 pv8 bgWhite'>
          <div className='black40 f14'>related field:</div>
          {relatedFieldElement}
        </div>
      </div>
    )
  }

  private didSelectModelWithName = (modelName: string) => {
    const model = this.props.models.find((model) => model.name === modelName)
    this.setState({model: model})
    console.log('did select: ', model)
    this.props.didSelectedModel(model)
  }

}
