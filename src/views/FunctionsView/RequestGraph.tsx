import * as React from 'react'
import {FunctionStats} from '../../types/types'
import {LineChart} from 'react-svg-chart'

interface Props {
  stats: FunctionStats
}

interface State {

}

export default class RequestGraph extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <style jsx={true}>{`
          div :global(.request-chart) {

          }
        `}</style>
        <LineChart
          lines={[
            {
              points: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 },
                { value: 4 },
                { value: 3 },
                { value: 2 },
                { value: 1 },
              ],
            },
          ]}
          width={300}
          height={100}
          pointSize={1}
          className='request-chart'
          labelSpacing={2}
          valueHeight={3}
          valueOffset={4}
          valueWidth={8}
          preserveAspectRatio='xMinYMid meet'
        />
      </div>
    )
  }
}
