import * as React from 'react'
import {Viewer} from '../../types/types'

interface Props {
  viewer: Viewer
}

export default class General extends React.Component<Props, {}> {

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`

          .container {
            @inherit: .flex, .flexColumn, .pt38, .pl60;
          }

          .contentBox {
            @inherit: .flex, .flexColumn, .pt16, .pb25;
          }

        `}</style>
        <div></div>
      </div>
    )
  }
}
