import * as React from 'react'
import {$v} from 'graphcool-styles'

interface Props {
  selectedIndex: number
  choices: string[]
  activeBackgroundColor: string
  onChange: (index: number, choice: string) => void
  inactiveBackgroundColor?: string
  inactiveTextColor?: string
}

export default class FieldHorizontalSelect extends React.Component<Props, {}> {

  render() {

    const {activeBackgroundColor, selectedIndex, onChange, choices} = this.props
    const inactiveTextColor = this.props.inactiveTextColor || $v.gray30
    const inactiveBackgroundColor = this.props.inactiveBackgroundColor || $v.gray04

    return (
      <div className={`container ${selectedIndex === -1 ? 'none-selected' : ''}`}>
        <style jsx={true}>{`
          .container {
            @inherit: .flex, .itemsCenter, .justifyCenter, .mv38, .relative, .bgBlack04, .ph16, .w100, .bbox;
            height: 42px;
          }

          .after-selection {
            @p: .absolute, .overflowHidden;
            content: "";
            left: 0px;
            top: -1px;
            height: 44px;
            width: 6px;
          }

          .after-selection .bar {
            @p: .bgBlue, .br2, .relative;
            height: 44px;
            left: -4px;
            width: 10px;
          }

          .element {
            @inherit: .relative, .pointer, .br2, .f14, .fw6, .ttu, .nowrap;
            margin: 0 -2px;
          }

        `}</style>
        {choices.map((choice, i) => {
          return (<div
            className='element'
            key={i}
            onClick={() => onChange(i, choice)}
            style={{
              backgroundColor: selectedIndex === i ? activeBackgroundColor : inactiveBackgroundColor,
              color: selectedIndex === i ? 'white' : inactiveTextColor,
              zIndex: selectedIndex === i ? 2 : 0,
              padding: selectedIndex === i ? '12px 18px' : '10px 16px',
            }}
          >
            {choice}
          </div>)
        })}
        {selectedIndex === -1 && (
          <div className='after-selection'>
            <div className='bar'></div>
          </div>
        )}
      </div>
    )
  }
}
