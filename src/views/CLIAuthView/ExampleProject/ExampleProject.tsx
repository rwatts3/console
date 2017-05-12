import * as React from 'react'
import ExampleProjectLeft from './ExampleProjectLeft'
import ExampleProjectRight from './ExampleProjectRight'

export type ProjectType = 'instagram' | 'blank'

interface State {
}

interface Props {
  location: any
}

export default class ExampleProject extends React.Component<Props, State> {

  render() {
    // const schema = this.props.location.query.schema || ''
    const projectType = this.props.location.query.projectType as ProjectType
    return (
      <div className='example-project'>
        <style jsx={true}>{`
            .example-project {
              @p: .w100, .h100, .flex, .fixed, .top0, .left0, .right0, .bottom0;
            }
        `}</style>
        <ExampleProjectLeft
          projectType={projectType}
        />
        <ExampleProjectRight
          projectType={projectType}
        />
      </div>
    )
  }
}
