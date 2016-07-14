import * as React from 'react'
import { PropTypes } from 'react'

interface Props {
  to: string
}

interface Context {
  router: any
}

export default class RedirectOnMount extends React.Component<Props, {}> {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  context: Context

  componentWillMount () {
    this.context.router.replace(this.props.to)
  }

  render () {
    return null
  }
}
