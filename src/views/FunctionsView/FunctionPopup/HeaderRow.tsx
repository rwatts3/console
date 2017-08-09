import * as React from 'react'
import { Icon, $v } from 'graphcool-styles'

interface HeaderRowProps {
  name: string
  value: string
  onChangeName: (e: any) => void
  onChangeValue: (e: any) => void
  onSubmit: () => void
  nameRef?: (ref: any) => void
}

export default class HeaderRow extends React.Component<HeaderRowProps, null> {
  render() {
    const {
      name,
      value,
      onChangeName,
      onChangeValue,
      onSubmit,
      nameRef,
    } = this.props
    return (
      <div className="edit-row">
        <style jsx>{`
          .name {
            @p: .white, .fw6, .f14;
            min-width: 120px;
          }
          .value {
            @p: .white, .f14;
          }
          .ok {
            @p: .bgLightgreen20, .br100, .flex, .itemsCenter, .justifyCenter,
              .mh16, .pointer, .flexFixed;
            width: 25px;
            height: 25px;
          }
          .edit-row {
            @p: .flex, .overflowHidden, .br2, .mb10, .mt6;
          }
          .left,
          .right {
            @p: .pv10, .ph12;
          }
          .left {
            @p: .bgWhite;
          }
          .right {
            @p: .br2, .brRight, .flex, .itemsCenter, .justifyBetween;
            background: rgb(245, 245, 245);
          }
          input {
            @p: .f14;
            background: none;
          }
          .name-input {
            @p: .blue;
            max-width: 125px;
          }
          .value-input {
            @p: .black80, .flexAuto;
            max-width: 125px;
          }
        `}</style>
        <div className="left">
          <input
            type="text"
            className="name-input"
            placeholder="Type a name ..."
            autoFocus
            value={name}
            onChange={onChangeName}
            ref={nameRef}
          />
        </div>
        <div className="right">
          <input
            type="text"
            className="value-input"
            placeholder="Type the content ..."
            value={value}
            onChange={onChangeValue}
            onKeyDown={this.handleKeyDown}
          />
          <div className="ok" onClick={onSubmit}>
            <Icon
              src={require('graphcool-styles/icons/fill/check.svg')}
              color={$v.green}
            />
          </div>
        </div>
      </div>
    )
  }

  private handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.props.onSubmit()
    }
  }
}
