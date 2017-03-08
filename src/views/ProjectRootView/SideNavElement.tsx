import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import {Link} from 'react-router'

interface Props {
  link: string
  active?: boolean
  iconSrc: string
  text: string
  size?: number
}

export default class SideNavElement extends React.Component<Props, null> {
  render() {
    const {link, active, iconSrc, text, size} = this.props
    return (
      <Link to={link} className={'link' + (active ? ' active' : '')}>
        <div className={'side-nav-element' + (active ? ' active' : '')}>
          <style jsx>{`
           .side-nav-element {
              @p: .relative, .flex, .itemsCenter, .w100, .fw6, .f14, .ttu, .white, .mt12, .o60;
              letter-spacing: 0.8px;
              padding-left: 25px;
              height: 36px;
              transition: color background-color .3s linear;
           }
           .side-nav-element.active, .side-nav-element:hover {
             @p: .bgWhite07, .o100;
           }
           .side-nav-element.active:before {
             @p: .absolute, .bgGreen, .br2, .z2;
             left: -2px;
             content: "";
             top: -1px;
             height: 38px;
             width: 8px
           }
           .icon {
             width: 24px;
           }
           .text {
             @p: .ml4;
           }
          `}</style>
          <div className='icon'>
            <Icon
              src={iconSrc}
              color={$v.white}
              height={size || 20}
              width={size || 20}
            />
          </div>
          <div className='text'>
            {text}
          </div>
        </div>
      </Link>
    )
  }
}
