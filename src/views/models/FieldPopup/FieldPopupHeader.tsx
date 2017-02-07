import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import {FieldPopupErrors, errorInTab} from './FieldPopupState'
import * as cn from 'classnames'

interface Props {
  activeTabIndex: number
  tabs: string[]
  onSelectTab: (index: number) => void
  onRequestClose: () => void
  errors: FieldPopupErrors
  showErrors: boolean
}

const FieldPopupHeader = ({activeTabIndex, onSelectTab, tabs, onRequestClose, errors, showErrors}: Props) => (
  <div className='field-popup-header'>
    <style jsx>{`
      .field-popup-header {
        @p: .flex, .relative;
        height: 70px;
      }

      .badge {
        @p: .bgGreen, .white, .absolute, .mt10, .f12, .fw6, .ttu, .top0, .br2;
        padding: 2px 4px;
        left: -4px;
      }
      .tabs {
        @p: .bb, .bBlack10, .flex1, .bbox, .overflowVisible, .flex, .itemsCenter, .pointer;
        height: 43px;
        padding-left: 88px;
        margin-right: 72px;
      }
      .close {
        @p: .absolute, .pointer;
        top: 23px;
        right: 24px;
      }
    `}</style>
    <div className='badge'>New Field</div>
    <div className='tabs'>
      {tabs.map((tab, index) => (
        <Tab
          key={tab}
          active={index === activeTabIndex}
          hasError={showErrors && errorInTab(errors, index)}
          onClick={() => onSelectTab(index)}
          needsMigration={errors.migrationValueMissing && index === 1}
        >{tab}</Tab>
      ))}
    </div>
    <div
      className='close'
      onClick={onRequestClose}
    >
      <Icon
        src={require('graphcool-styles/icons/stroke/cross.svg')}
        stroke
        strokeWidth={2}
        color={$v.gray40}
        width={26}
        height={26}
      />
    </div>
  </div>
)

export default FieldPopupHeader

interface TabProps {
  active?: boolean
  children?: JSX.Element
  onClick: any
  hasError: boolean
  needsMigration: boolean
}

const Tab = ({active, children, onClick, hasError, needsMigration}: TabProps) => {
  return (
    <div
      className={cn(
        'tab',
        {
          'active': active,
          'error': hasError,
          'needs-migration': !hasError && needsMigration, // prioritize errors over migration
        },
      )}
      onClick={onClick}
    >
      <style jsx>{`
        .tab {
          @p: .fw6, .f12, .black30, .ttu, .relative, .pv10;
          letter-spacing: 0.45px;
        }

        .tab + .tab {
          @p: .ml25;
        }

        .tab.active {
          @p: .green;
        }

        .after-active {
          @p: .absolute, .bbox, .bgWhite;
          top: 39px;
          border-left: 6px solid white;
          border-right: 6px solid white;
          left: -12px;
          width: calc(100% + 24px);
          height: 4px;
        }

        .bar {
          @p: .bbox, .bgGreen30;
          border-radius: 1.5px;
          width: 100%;
          height: 3px;
        }

        .tab.error {
          @p: .red;
        }

        .tab.needs-migration {
          @p: .lightOrange;
        }

        .error .bar {
          @p: .bgrRed;
        }

        .needs-migration .bar {
          @p: .bgLightOrange;
        }
      `}</style>
      {children}
      {active && (
        <div className='after-active'>
          <div className='bar'></div>
        </div>
      )}
    </div>
  )
}