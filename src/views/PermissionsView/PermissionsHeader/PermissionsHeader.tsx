import * as React from 'react'
import Info from '../../../components/Info'
import * as cn from 'classnames'

interface Props {
  activeTab: number
  onChangeTab: (i: number) => void
}

export default class PermissionsHeader extends React.Component<Props, {}> {
  render() {
    const {activeTab, onChangeTab} = this.props
    return (
      <div className='permissions-header'>
        <style jsx={true}>{`
          .permissions-header {
            @p: .pt25, .br2, .flexColumn;
          }
          h1 {
            @p: .f38, .fw3, .lhSolid, .ml25;
          }
          .tabs {
            @p: .flex, .justifyStart, .mt25;
          }
          .tab {
            @p: .fw4, .f25, .black30, .relative, .mr10, .pointer, .z2;
            bottom: -1px;
            padding: 10px 20px;
          }
          .tab.active {
            @p: .black50, .bgWhite, .bt, .bl, .br, .bBlack10, .br2;
          }
          .tab:not(.active):hover {
            @p: .black50;
          }
        `}</style>
        <div className='flex itemsCenter'>
          <h1>Permissions</h1>
          <Info>
            You can read more about Permissions
            <a
              href='https://www.graph.cool/docs/reference/platform/authorization/overview-iegoo0heez/'
              target='_blank'
            >
              in the docs
            </a>
          </Info>
        </div>
        <div className='tabs'>
          <div
            className={cn('tab', {active: activeTab === 0})}
            onClick={() => onChangeTab(0)}
          >
            Types
          </div>
          <div
            className={cn('tab', {active: activeTab === 1})}
            onClick={() => onChangeTab(1)}
          >
            Relations
          </div>
        </div>
      </div>
    )
  }
}
