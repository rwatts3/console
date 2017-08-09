import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { closePopup } from '../../actions/popup'
import { ReduxAction } from '../../types/reducers'

interface Props {
  id?: string
  closePopup: (id: string) => ReduxAction
  onClickOutside?: (e: any) => void
}

class PopupWrapper extends React.Component<Props, {}> {
  container: any

  componentDidMount() {
    document.addEventListener('keydown', this.keyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown)
  }

  keyDown = (e: KeyboardEvent) => {
    if (
      e.keyCode === 27 &&
      !(
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
    ) {
      this.close(e)
    }
  }

  render() {
    return (
      <div
        className="popup-wrapper"
        style={{
          overflow: 'scroll',
        }}
        onClick={this.handleClick}
        ref={this.setRef}
      >
        <style jsx={true}>{`
          .popup-wrapper {
            @p: .fixed, .left0, .right0, .top0, .bottom0, .z999;
          }
        `}</style>
        {this.props.children}
      </div>
    )
  }

  private setRef = ref => {
    this.container = ref
  }

  private handleClick = (e: any) => {
    const container: Element = ReactDOM.findDOMNode(this.container)
    if (!container.children) {
      return
    }
    if (container.children[0] !== e.target) {
      return
    }

    this.close(e)
  }

  private close = (e: any) => {
    // hack.
    // we have the background div in each popup at the moment
    // so when the first child of this container is clicked,
    // close the popup
    if (typeof this.props.onClickOutside === 'function') {
      this.props.onClickOutside(e)
    }
    if (this.props.id && this.props.id.length > 0) {
      this.props.closePopup(this.props.id)
    }
  }
}

export default connect(null, {
  closePopup,
})(PopupWrapper)
