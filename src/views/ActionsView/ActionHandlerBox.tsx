import * as React from 'react'
const classes: any = require('./ActionTriggerBox.scss')

interface Props {
  handlerWebhookUrl: string
  valid: boolean
  update: (payload: UpdateHandlerPayload) => void
}

export interface UpdateHandlerPayload {
  handlerWebhookUrl?: string
}

export default class ActionHandlerBox extends React.Component<Props, {}> {

  render() {

    return (
      <div className={classes.root}>
        <div className={classes.head}>
          2. Handler
          <input
            type='checkbox'
            checked={this.props.valid}
          />
        </div>
        <input
          type='text'
          value={this.props.handlerWebhookUrl}
          onChange={(e) => this.props.update({ handlerWebhookUrl: e.target.value })}
          />
      </div>
    )
  }
}
