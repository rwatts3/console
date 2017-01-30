import * as React from 'react'
import {Model, Field} from '../../types/types'
import {Icon} from 'graphcool-styles'
import { Combobox } from 'react-input-enhancements'

interface State {
  dropdownExpanded: boolean
  model: Model | null
}

interface Props {
  relatedField: Field | null
  many: boolean
  models: Model[]
}

export default class ModelSelectionBox extends React.Component<Props, State> {

  state = {
    dropdownExpanded: false,
    model: null,
  }

  render() {
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
        <div className={`flex itemsCenter justifyBetween pv8 ph16 ${this.state.model ? 'bgBlue' : 'bgBlue20'}`}>
          <div className={`titleText ${this.state.model ? 'white' : 'blue'}`}>Select Model</div>
          <div
            className='pointer'
            onClick={() => this.setState({dropdownExpanded: true} as State)}
          >
            <Icon
              rotate={90}
              src={require('graphcool-styles/icons/fill/triangle.svg')}
              width={8}
              height={7}
              color='blue'
            />
          </div>
        </div>
        <div className='ph16 pv8 bgWhite'>
          <div className='black40 f14'>related field:</div>
          <div className=' pv8 black20 f20 i'>will be generated</div>
        </div>
      </div>
    )
  }
}
