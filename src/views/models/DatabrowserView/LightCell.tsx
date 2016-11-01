import * as React from 'react'

interface Props {
  onClick: () => void
  onDoubleClick: () => void
  value: string
}

export class LightCell extends React.PureComponent<Props, {}> {
  render() {
    const { onClick, onDoubleClick, value } = this.props
    return (
      <span
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {value && value.toString()}
      </span>
    )
  }
}
