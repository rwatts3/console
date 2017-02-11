import * as React from 'react'
import UsageIndicator from './UsageIndicator'
import UsedSeats from './Seats'

interface Props {
  usedSeats: string[]
}

export default class Usage extends React.Component<Props, {}> {

  render() {

    const maxSeats = 2

    return (
      <div className='container'>
        <style jsx={true}>{`

          .container {
            @p: .flex, .flexColumn, .ph60;
          }

          .title {
            @p: .black30, .fw6, .f14, .ttu;
          }

        `}</style>
        <div className='title'>Usage</div>
        <UsageIndicator
          metric='Nodes'
          currentUsage={20701}
        />
        <UsageIndicator
          metric='Operations'
          currentUsage={101980}
        />
        <UsedSeats
          seats={this.props.usedSeats}
          maxSeats={maxSeats}
        />
      </div>
    )
  }
}
