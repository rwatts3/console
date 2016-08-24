import * as React from 'react'
import ClickOutside from 'react-click-outside'
import CopyToClipboard from 'react-copy-to-clipboard'
const classes: any = require('./ApiLayover.scss')

type Endpoint = 'simple/v1' | 'relay/v1'

interface Props {
  projectId: string
  close: () => void
}

interface State {
  endpoint: Endpoint
  copied: boolean
}

export default class ApiLayover extends React.Component<Props, State> {

  state = {
    endpoint: 'simple/v1' as Endpoint,
    copied: false,
  }

  _onCopy () {
    this.setState({ copied: true } as State)
    setTimeout(this.props.close, 900)
  }

  _selectEndpoint (endpoint: Endpoint) {
    this.setState({ endpoint } as State)
  }

  render() {
    const url = `https://api.graph.cool/${this.state.endpoint}/${this.props.projectId}`

    return (
      <ClickOutside onClickOutside={() => this.props.close()}>
        <div className={classes.root}>
          <div className={classes.endpoints}>
            <select onChange={(e) => this._selectEndpoint((e.target as HTMLSelectElement).value as Endpoint)}>
              <option>simple/v1 ▾</option>
              <option>relay/v1 ▾</option>
            </select>
          </div>
          <div className={classes.url}>{url}</div>
          <CopyToClipboard text={url}
            onCopy={() => this._onCopy()}>
            <span className={classes.copy}>
              {this.state.copied ? 'Copied' : 'Copy'}
            </span>
          </CopyToClipboard>
        </div>
      </ClickOutside>
    )
  }
}
