import * as React from 'react'
import {Voyager} from 'graphql-voyager'

interface State {
  active: boolean
}

export default class Tester extends React.Component<null,State> {
  constructor() {
    super()
    this.state = {
      active: true
    }

    setInterval(this.toggle, 10000)
  }
  render() {
    const {active} = this.state
    return (
      active ? <Voyager introspection={this.introspectionProvider} /> : null
    )
  }
  private toggle = () => {
    this.setState(({active}) => {
      return {
        active: !active
      }
    })
  }

  private introspectionProvider = (query) => {
    return fetch('https://api.graph.cool/simple/v1/aasdf', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({query})
    })
      .then(res => res.json())
  }
}
