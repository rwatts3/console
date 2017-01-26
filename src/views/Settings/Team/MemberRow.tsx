import * as React from 'react'
import * as Relay from 'react-relay'

interface Props {
  isPending: boolean
  isCurrentUser: boolean
  isProjectOwner: boolean
}

export default class MemberRow extends React.Component<Props, {}> {

  render() {
    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .flex, .itemsCenter;
          }
        `}</style>
        {this.props.isPending ?
          (
            <div>Pending</div>
          ) :
          (
            <div>Member</div>
          )
        }
      </div>
    )

  }
}
