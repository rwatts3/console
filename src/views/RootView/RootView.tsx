import * as React from 'react'
import Helmet from 'react-helmet'
import { NotificationLevel } from '../../types/utils'
import NotificationSystem from 'react-notification-system'

interface Props {
  children: Element
}

export default class RootView extends React.Component<Props, {}> {

  static childContextTypes = {
    showNotification: React.PropTypes.func,
  }

  refs: {
    [key: string]: any;
    notificationSystem: any
  }

  _notificationSystem: any

  getChildContext () {
    return {
      showNotification: (message: string, level: NotificationLevel): void => {
        this._notificationSystem.addNotification({ message, level })
      },
    }
  }

  componentDidMount () {
    this._notificationSystem = this.refs.notificationSystem
  }

  render () {
    return (
      <div style={{ height: '100%' }}>
        <Helmet titleTemplate='%s | Graphcool'/>
        {this.props.children}
        <NotificationSystem ref='notificationSystem' />
      </div>
    )
  }
}
