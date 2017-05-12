import * as React from 'react'
import ExampleProjectLeft from './ExampleProjectLeft'
import ExampleProjectRight from './ExampleProjectRight'

interface State {

}

interface Props {

}

export default class ExampleProject extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className='example-project'>
        <style jsx={true}>{`
            .example-project {
              @p: .w100, .h100, .flex, .flexRow;
            }

        `}</style>
        <ExampleProjectLeft className='w100 h100' />
        <ExampleProjectRight />
      </div>
    )
  }
}
