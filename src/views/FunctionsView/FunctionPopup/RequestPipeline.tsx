import * as React from 'react'
import {FunctionBinding} from '../../../types/types'
import {Icon, $v} from 'graphcool-styles'
import * as cn from 'classnames'
import Info from '../../../components/Info'

interface Props {
  binding: FunctionBinding
  onChange: (binding: FunctionBinding) => void
}

export default function RequestPipeline({binding, onChange}: Props) {

  const argActive = binding === 'TRANSFORM_ARGUMENTS' as FunctionBinding
  const preActive = binding === 'PRE_WRITE' as FunctionBinding
  const payloadActive = binding === 'TRANSFORM_PAYLOAD' as FunctionBinding

  return (
    <div className='request-pipeline'>
      <style jsx={true}>{`
        .request-pipeline {
          @p: .w100, .flex, .itemsCenter, .justifyBetween, .mb60;
          margin-top: 80px;
        }
        .step {
          @p: .relative, .flex, .flexColumn, .itemsCenter, .justifyCenter;
        }
        .label {
          @p: .mono, .fw5, .blue50, .f14, .absolute, .tc, .pointer;
          top: 40px;
          width: 102px;
        }
        .label.disabled {
          @p: .darkBlue20;
          cursor: no-drop;
        }
        .label.active {
          @p: .blue;
        }
        .step:hover .circle:not(.disabled):not(.active) :global(i) {
          @p: .o60;
        }
        .step:hover .label:not(.disabled):not(.active) {
          @p: .blue;
        }
      `}</style>
      <Arrow />
      <Info top customTip={
        <div className='step'>
          <Circle disabled />
          <div className='label disabled'>TRANSFORM _REQUEST</div>
        </div>
      }>This hook includes the raw input without any GraphQL Type checking.</Info>
      <div className='step'>
        <Tip>Schema Validation</Tip>
        <Arrow />
      </div>
      <Info top customTip={
        <div className='step' onClick={() => onChange('TRANSFORM_ARGUMENTS' as FunctionBinding)}>
          <Circle active={argActive}/>
          <div className={cn('label', {active: argActive})}>TRANSFORM _ARGUMENTS</div>
        </div>
      }>In this hook you can transform the input data</Info>
      <div className='step'>
        <Tip>Data Validation</Tip>
        <Arrow />
      </div>
      <Info top customTip={
        <div className='step' onClick={() => onChange('PRE_WRITE')}>
          <Circle active={preActive}/>
          <div className={cn('label', {active: preActive})}>PRE_WRITE</div>
        </div>
      }>In this step you can perform validation or eg. charge a User on Stripe</Info>
      <Arrow />
      <Info top customTip={
        <div className='step'>
          <Tip bottom={35}>Data Write</Tip>
          <Icon
            src={require('graphcool-styles/icons/fill/writedatabase.svg')}
            width={34}
            height={34}
            color={$v.darkBlue30}
          />
        </div>
      }>Here the data is actually written to the datbase.</Info>
      <Arrow />
      <Info top customTip={
        <div className='step' onClick={() => onChange('TRANSFORM_PAYLOAD')}>
          <Circle active={payloadActive}/>
          <div className={cn('label', {active: payloadActive})}>TRANSFORM _PAYLOAD</div>
        </div>
      }>This step allows you to transform the payload, eg. removing secret data</Info>
      <Arrow />
      <Info top customTip={
        <div className='step'>
          <Circle disabled/>
          <div className='label disabled'>TRANSFORM _RESPONSE</div>
        </div>
      }>This hook would allow manipulating the raw output without any GraphQL Checks</Info>
      <Arrow disableArrow />
    </div>
  )
}

interface TipProps {
  children?: any
  bottom?: number
}

function Tip({children, bottom}: TipProps) {
  return (
    <div className='tip' style={{bottom}}>
      <style jsx={true}>{`
        .tip {
          @p: .absolute, .f12, .darkBlue40, .flex, .flexColumn, .itemsCenter, .justifyStart, .tc;
          bottom: 7px;
          width: 60px;
        }
        .line {
          @p: .relative, .bgDarkBlue50, .o30;
          margin-top: 1px;
          height: 21px;
          width: 1px;
        }
      `}</style>
      <div>{children}</div>
      <div className='line'></div>
    </div>
  )
}

interface CircleProps {
  active?: boolean
  disabled?: boolean
  onClick?: (e: any) => void
}

function Circle({active, disabled, onClick}: CircleProps) {
  return (
    <div className={cn('circle', {active, disabled})} onClick={onClick}>
      <style jsx>{`
      .circle {
        @p: .br100, .ba, .bw2, .bBlue, .o50, .flex, .itemsCenter, .justifyCenter, .pointer;
        width: 29px;
        height: 29px;
      }
      .circle.active {
        @p: .bgBlue, .o100;
      }
      .circle:not(.active):not(.disabled):hover {
        @p: .bgBlue;
      }
      .circle.disabled {
        @p: .o100, .bDarkBlue10;
        cursor: no-drop;
      }
      .circle :global(i) {
        @p: .o0;
      }
      .circle.active :global(i) {
        @p: .o100;
      }
      .circle:not(.disabled):not(.active):hover :global(i) {
        @p: .o60;
      }
      `}</style>
      <Icon
        src={require('graphcool-styles/icons/fill/check.svg')}
        color={disabled ? $v.darkBlue20 : $v.white}
        width={21}
        height={21}
      />
    </div>
  )
}

interface ArrowProps {
  disableArrow?: boolean
}

function Arrow({disableArrow}: ArrowProps) {
  return (
    <div className='arrow'>
      <style jsx>{`
        .arrow {
          @p: .relative, .flex, .itemsCenter;
          background: #CCD0D3;
          width: 46.6px;
          height: 2px;
        }
        .arrow :global(i) {
          @p: .absolute;
          right: -6px;
        }
      `}</style>
      {!disableArrow && (
        <Icon
          src={require('graphcool-styles/icons/fill/arrowhead.svg')}
          color='#CCD0D3'
          width={12}
          height={12}
        />
      )}
    </div>
  )
}
