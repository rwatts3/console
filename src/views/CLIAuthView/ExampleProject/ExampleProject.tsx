import * as React from 'react'
import ExampleProjectLeft from './ExampleProjectLeft'
import ExampleProjectRight from './ExampleProjectRight'

export type ProjectType = 'instagram' | 'blank'

interface State {
  projectType: ProjectType
}

interface Props {
}

export default class ExampleProject extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      projectType: 'instagram'
    }
  }

  render() {
    return (
      <div className='example-project'>
        <style jsx={true}>{`
            .example-project {
              @p: .w100, .h100, .flex, .fixed, .top0, .left0, .right0, .bottom0;
            }
        `}</style>
        <ExampleProjectLeft
          projectType={this.state.projectType}
        />
        <ExampleProjectRight
          projectType={this.state.projectType}
        />
      </div>
    )
  }
}
