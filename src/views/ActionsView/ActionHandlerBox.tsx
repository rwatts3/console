import * as React from 'react'
import Icon from '../../components/Icon/Icon'
const classes: any = require('./ActionHandlerBox.scss')
const sharedClasses: any = require('./ActionBox.scss')

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

        <div className={sharedClasses.head}>
          <div className={sharedClasses.title}>Handler</div>
          <Icon
            width={24}
            height={24}
            src={require(`assets/new_icons/${this.props.valid ? 'check' : 'warning'}.svg`)}
            color={this.props.valid ? '#7ED321' : '#F5A623'}
          />
        </div>

        <div className={sharedClasses.info}>
          Enter the URL to your webhook which will be called each time the action is triggered.
        </div>

        <div className={classes.input}>
          <input
            type='text'
            value={this.props.handlerWebhookUrl}
            onChange={(e) => this.props.update({ handlerWebhookUrl: e.target.value })}
            placeholder='Enter Webhook URL'
          />
        </div>

        <div className={sharedClasses.info}>
          You can find an example&nbsp;
          <a href='https://github.com/graphcool-examples/webhook-express-example' target='_blank'>here</a>.
          We recommend using <a href='https://webtask.io/' target='_blank'>Webtask</a> or&nbsp;
          <a href='http://docs.aws.amazon.com/lambda/latest/dg/welcome.html' target='_blank'>AWS Lambda</a>&nbsp;
          for your webhooks.
        </div>
      </div>
    )
  }
}
