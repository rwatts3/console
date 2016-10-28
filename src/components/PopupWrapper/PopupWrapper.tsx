import * as React from 'react'
import { connect } from 'react-redux'
import {closePopup} from '../../actions/popup'
import {ReduxAction} from '../../types/reducers'

interface Props {
  id?: string
  closePopup: (id: string) => ReduxAction
}

class PopupWrapper extends React.Component<Props, {}> {
  refs: {
    container: Element
  }

  render() {
    return (
      <div
        className='fixed left-0 right-0 top-0 bottom-0 z-999'
        style={{
          overflow: 'scroll',
        }}
        onClick={this.close.bind(this)}
        ref='container'
      >
        {this.props.children}
      </div>
    )
  }

  private close = (e: any) => {
    // hack.
    // we have the background div in each popup at the moment
    // so when the first child of this container is clicked,
    // close the popup
    if (this.refs.container.children[0] !== e.target) {
      return
    }
    if (this.props.id && this.props.id.length > 0) {
      this.props.closePopup(this.props.id)
    }
  }
}

export default connect(null, {
  closePopup,
})(PopupWrapper)
