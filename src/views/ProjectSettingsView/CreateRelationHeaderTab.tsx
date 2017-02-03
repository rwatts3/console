
import * as React from 'react'

interface Props {
  title: string
  selected: boolean
  onClick: Function
}

export default class CreateRelationHeaderTab extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div>

      <div
        className={`titleTab ${leftTabColor}`}
        onClick={() => this.props.switchDisplayState('DEFINE_RELATION' as RelationPopupDisplayState)}
      >

        Define Relations
      </div>

      </div>
    )
  }
}
