import * as React from 'react'
import {Model} from '../../types/types'
import {Combobox} from 'react-input-enhancements'
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
  forbiddenFieldNames: string[]
  // messagesForBreakingChange: string[]
}

export default class ModelSelectionBox extends React.Component<Props, {}> {

  render() {

    const modelNames = this.props.models.map(model => model.name)

    let offsets: number[] = []
    let plain: boolean[] = []
    if (this.props.inputIsBreakingChange) {
      offsets.push(80)
      plain.push(true)
    }
    if (this.props.modelIsBreakingChange) {
      offsets.push(16)
      plain.push(true)
    }

    return (
      <div className={`${this.props.many && 'topMargin20'}`}>
        <style jsx={true}>{`

          .bottomBorder {
            border-bottom-style: solid;
            border-bottom-width: 1px;
            border-color: rgba(255,255,255,.2);
          }

          .negativeMargin {
            margin: -5px -5px -5px -5px;
            border-radius: 3px;
          }

        `}</style>
        <div className='buttonShadow br2'>
          <BreakingChangeIndicator
            className='br2'
            indicatorStyle='RIGHT'
            width={16}
            height={12}
            offsets={offsets}
            plain={plain}
          >
            <div className={`flex itemsCenter justifyBetween pv8 ph16
              ${this.props.selectedModel ? ' bgBlue' : ' bgBlue20'}`}
                 style={{borderTopLeftRadius: '2px', borderTopRightRadius: '2px'}}
            >
              <Combobox
                options={modelNames}
                value={this.props.selectedModel ? this.props.selectedModel.name : 'Select Model'}
                onSelect={(value) => this.didSelectModelWithName(value)}
                dropdownProps={{
                  className: `${this.props.selectedModel ? 'white' : 'blue' } f20`,
                }}
              >
                {this.renderInput}
              </Combobox>
            </div>
            <FieldNameInput
              relatedFieldName={this.props.relatedFieldName}
              relatedFieldType={this.props.relatedFieldType}
              didChangeFieldName={this.props.didChangeFieldName}
              forbiddenFieldNames={this.props.forbiddenFieldNames}
            />
          </BreakingChangeIndicator>
        </div>
        {this.props.many &&
        <div
          className='flex flexColumn itemsCenter z1'
          style={{height: '20px', width: '100%'}}>
          <div
            className='bgWhite'
            style={{
              boxShadow: '0px 1px 3px rgba(0,0,0,.15)',
              width: '95%',
              height: '10px',
              borderBottomRightRadius: '2px',
              borderBottomLeftRadius: '2px',
              zIndex: 2,
            }}
          />
          <div
            className='bgWhite'
            style={{
              boxShadow: '0px 1px 3px rgba(0,0,0,.15)',
              width: '90%',
              height: '8px',
              borderBottomRightRadius: '2px',
              borderBottomLeftRadius: '2px',
              zIndex: 1,
            }}
          />
        </div>
        }
      </div>
    )
  }

  private didSelectModelWithName = (modelName: string) => {
    const model = this.props.models.find((model) => model.name === modelName)
    this.props.didSelectedModel(model)
  }

  private renderInput = inputProps => {
    return <input
      {...inputProps}
      value={this.props.selectedModel ? this.props.selectedModel.name : 'Select Model'}
      onChange={() => this.props.didSelectedModel}
      type='text'
      className={`f25 fw6 bgTransparent ${this.props.selectedModel ? 'white' : 'blue'}`}
      style={{width: '180px'}}
    />

  }

}

/*

 dropdownProps={{
 className: `${this.props.selectedModel ? 'white' : 'blue' } fw6 f25`,
 }}
 onRenderOption={(className, option, isActive) => {
 console.log(option, isActive)
 const colors = isActive ? 'white bgBlue' : 'bgWhite black60'
 const margin = isActive ? 'negativeMargin' : ''
 return (
 <div
 className={`bb bBlack10 tl pv10 pl16 ${colors} ${margin}`}
 style={{height: '52px'}}
 >
 {option}
 </div>
 )
 }}

 */
