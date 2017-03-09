import * as React from 'react'

interface Props {
  children?: JSX.Element
  slim?: boolean
  bright?: boolean
}

const Info = (props: Props) => (
  <div className='info'>
    <style jsx>{`
      .question-mark {
        @p: .bgBlack10, .flex, .itemsCenter, .justifyCenter, .black40, .f12, .fw6, .br100, .pointer;
        width: 18px;
        height: 18px;
      }
      .question-mark.bright {
        @p: .bgBlue, .white;
      }
      .tooltip {
        @p: .dn, .absolute;
        z-index: 20;
        width: 250px;
        padding-top: 5px;
        left: -50px;
      }
      .tooltip.slim {
        width: 200px;
      }
      .tooltip-content {
        @p: .br2, .bgWhite, .pa16, .black50, .f14, .fw4, .relative, .buttonShadow;
        &:before {
          @p: .absolute, .bgWhite;
          content: "";
          top: -4px;
          left: 55px;
          transform: rotate(45deg);
          width: 8px;
          height: 8px;
        }
      }
      .info {
        @p: .ml10, .relative;
        &:hover .tooltip {
          @p: .db;
        }
        &:hover .question-mark {
          @p: .bgBlue, .white;
        }
      }
      span {
        @p: .relative;
        left: 1px;
      }

    `}</style>
    <div className={'question-mark' + (Boolean(props.bright) ? ' bright' : '')}>
      <span>?</span>
    </div>
    <div className={'tooltip' + (Boolean(props.slim) ? ' slim' : '')}>
      <div className='tooltip-content'>
        {props.children}
      </div>
    </div>
  </div>
)

export default Info
