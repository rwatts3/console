import * as React from 'react'
import * as cx from 'classnames'
import {$g} from 'graphcool-styles'
import Icon from 'graphcool-styles/dist/components/Icon/Icon'
import DocsResource from './DocsResource'

export type ResourceType = 'faq' | 'guide' | 'example' | 'article'

export interface Resource {
  title: string
  link: string
  type: ResourceType
}

interface Props {
  resources: Resource[]
  // the ID is needed for the remember function of the active state
  id: string
  title: string
}

interface State {
  open: boolean
  firstTime: boolean
}

export default class ModalDocs extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    const key = 'modal-docs-opened:' + props.id
    const opened = localStorage.getItem(key)

    this.state = {
      open: false,
      firstTime: !Boolean(opened),
    }

    localStorage.setItem(key, '1')
  }

  render() {
    const active = this.state.firstTime || this.state.open

    return (
      <div className='modal-docs'>
        <style jsx>{`
          .modal-docs {
            @p: .relative;
          }
          .header {
            @p: .flex, .itemsCenter;
          }
          .icon {
            @p: .br100, .flex, .itemsCenter, .justifyCenter, .f25, .fw6, .tc, .bgBlack07, .black30, .pointer;
            width: 38px;
            height: 38px;
          }
          .icon:hover {
            @p: .bgBlack10, .black40;
          }
          .icon.active {
            @p: .bgLightgreen20, .green;
          }
          .icon.active:hover {
            @p: .bgLightgreen30;
          }
          .docs {
            @p: .absolute;
            top: 16px;
            right: -38px;
            transform: translateX(100%);
          }
          .content {
            @p: .mt25, .ml6;
          }
          .button {
            @p: .bgWhite, .pv10, .ph16, .lhSolid, .br2, .f20, .pointer, .nowrap;
            @p: .inlineFlex, .buttonShadow, .itemsCenter;
            color: rgba(23,42,58,.7);
          }
          .button:hover {
            @p: .bgBlack10;
          }
          .button span {
            @p: .ml10;
          }
          .button:hover :global(svg) {
            fill: rgba(23,42,58,.5);
          }
          .title  {
            @p: .green, .f16, .fw6, .ttu, .ml10;
          }
        `}</style>
        {this.props.children}
        <div className='docs'>
          <div className='header'>
            <div className={cx('icon', {active})} onClick={this.toggle}>
              <span>?</span>
            </div>
            {this.state.open && (
              <div className='title'>{this.props.title}</div>
            )}
          </div>
          {/*
          <div className='content'>
            <div className='button'>
              <Icon
                src={require('graphcool-styles/icons/fill/triangle.svg')}
                color='rgba(23,42,58,.4)'
                width={15}
                height={13}
              />
              <span>Watch an introduction</span>
            </div>
          </div>
           */}
          {this.state.open && (
            <div className='content'>
              {this.props.resources.map(resource => (
                <DocsResource
                  key={resource.link}
                  resource={resource}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  private toggle = () => {
    this.setState(state => ({
      ...state,
      open: !state.open,
    }))
  }
}
