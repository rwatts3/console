import * as React from 'react'
import {FunctionBinding, Model} from '../../../types/types'

interface Props {
  models: Model[]
  selectedModelId: string
  binding: FunctionBinding
  onModelChange: (modelId: string) => void
  onBindingChange: (binding: FunctionBinding) => void
}

export default function Trigger({models, selectedModelId, binding, onModelChange, onBindingChange}: Props) {
  return (
    <div className='trigger'>
      <style jsx>{`
        .trigger {
          @p: .darkBlue50, .f16;
        }
        .intro {
          margin-top: 8px;
          @p: .ph16;
        }
        .n {
          @p: .br100, .bgDarkBlue40, .white, .f14, .tc, .dib, .fw6, .mr4;
          line-height: 20px;
          width: 20px;
          height: 20px;
        }
        .n.blue {
          @p: .bgBlue, .white;
        }
        .text {
          padding: 0 22px;
        }
        b {
          @p: .fw6;
        }
        .line {
          @p: .w100, .bb, .bDarkBlue10, .mv25;
        }
        .choose {
          @p: .flex, .itemsCenter;
        }
        select {
          @p: .ml38, .f20, .blue, .fw6, .tl, .relative;
          border: 2px solid $blue50;
          border-radius: 3px;
          padding: 12px 16px;
          padding-right: 44px;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: none;
        }
        .triangle {
          @p: .absolute, .f12, .blue;
          pointer-events: none;
          top: 18px;
          right: 15px;
        }
      `}</style>
      <div className='intro'>
        <div className='text'>
          To manipulate data while processing, you need to <span className='n'>1</span>
          <b>choose a type</b> whose request pipeline you want to hook, and <span className='n'>2</span>
          <b>choose a step</b> within this pipeline.
        </div>
        <div className="line"></div>
        <div className='choose'>
          <div className="n blue">1</div>
          <div>Choose a type to hook in:</div>
          <div className="relative">
            <select value={selectedModelId}>
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
            <div className="triangle">▼</div>
          </div>
        </div>
        <div className="line"></div>
      </div>
    </div>
  )
}
