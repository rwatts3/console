import * as React from 'react'
import {FunctionBinding, Model, RequestPipelineMutationOperation} from '../../../types/types'
import RequestPipeline from './RequestPipeline'

interface Props {
  models: Model[]
  selectedModelId: string
  binding: FunctionBinding
  onModelChange: (modelId: string) => void
  onBindingChange: (binding: FunctionBinding) => void
  operation: RequestPipelineMutationOperation
  onChangeOperation: (operation: RequestPipelineMutationOperation) => void
}

export default function Trigger({
  models, selectedModelId, binding, onModelChange, onBindingChange, operation, onChangeOperation,
}: Props) {
  return (
    <div className='trigger'>
      <style jsx>{`
        .trigger {
          @p: .darkBlue50, .f16;
        }
        .intro {
          margin-top: 8px;
        }
        .n {
          @p: .br100, .bgDarkBlue40, .white, .f14, .tc, .dib, .fw6, .mr4;
          line-height: 20px;
          width: 20px;
          height: 20px;
        }
        .n.active {
          @p: .bgBlue, .white;
        }
        .n.inactive {
          @p: .bgDarkBlue10, .darkBlue50;
        }
        .n.second {
          @p: .relative;
          top: 2px;
        }
        .text {
          @p: .ph38;
        }
        b {
          @p: .fw6;
        }
        .line {
          @p: .w100, .bgDarkBlue10;
          height: 2px;
        }
        .choose {
          @p: .flex, .itemsCenter, .ph10;
        }
        select {
          @p: .f20, .blue, .fw6, .tl, .relative;
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
        .steps {
          @p: .bgBlack02, .pb25;
        }
        .steps-intro {
          @p: .flex, .itemsStart, .pt25, .ph10;
        }
        a {
          @p: .blue, .underline;
        }
        .description {
          margin-left: 7px;
        }
        select, option {
          font-family: 'Open Sans', sans-serif;
        }
      `}</style>
      <div className='intro'>
        <div className='text'>
          To manipulate data while processing, you need to <span className='n'>1</span>
          <b>choose a type</b> whose request pipeline you want to hook, and <span className='n'>2</span>
          <b>choose a step</b> within this pipeline.
        </div>
        <div className='line mv25 ph16'></div>
        <div className='choose'>
          <div className='n active'>1</div>
          <div className='description'>Choose a type and mutation to hook in:</div>
          <div className='relative'>
            <select
              value={selectedModelId}
              className='ml38'
              onChange={(e: any) => onModelChange(e.target.value)}
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
            <div className='triangle'>▼</div>
          </div>
          <div className='mh16'>is</div>
          <div className='relative'>
            <select
              value={operation}
              onChange={(e: any) => onChangeOperation(e.target.value)}
            >
              {operations.map(operation => (
                <option key={operation} value={operation}>{operation.toLowerCase() + 'd'}</option>
              ))}
            </select>
            <div className='triangle'>▼</div>
          </div>
        </div>
      </div>
      <div className='line mt25'></div>
      <div className='steps'>
        <div className='steps-intro'>
          <div className='n inactive second'>2</div>
          <div className='description'>
            <div>
              Choose a step within the data processing, you want to hook in.
            </div>
            <a href='/'>More about what you can do in each step</a>
          </div>
        </div>
        <RequestPipeline
          binding={binding}
          onChange={onBindingChange}
        />
      </div>
    </div>
  )
}

const operations = ['CREATE', 'UPDATE', 'DELETE']
