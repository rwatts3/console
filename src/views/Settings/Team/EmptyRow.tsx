import * as React from 'react'

interface State {

}

interface Props {
  hasAddFunctionality: boolean
}

export default class EmptyRow extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div></div>
    )
  }
}
