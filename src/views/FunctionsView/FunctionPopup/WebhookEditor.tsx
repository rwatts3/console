import * as React from 'react'

interface Props {
  url: string
  onChangeUrl: (url: string) => void
}

interface State {

}

export default class WebhookEditor extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const {url, onChangeUrl} = this.props
    return (
      <div className='webhook-editor'>
        <style jsx={true}>{`
          .webhook-editor {

          }
          textarea {
            @p: .f14, .white, .mono, .pa10, .w100;
            background: none;
            border: none;
            word-break: break-all;
            resize: none;
          }
        `}</style>
        <textarea
          autoFocus
          rows={3}
          onChange={this.urlChange}
          onKeyDown={this.keyDown}
          placeholder='Paste your webhook url here…'
          value={url}
        />
      </div>
    )
  }

  private urlChange = e => {
    this.props.onChangeUrl(e.target.value)
  }

  private keyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
