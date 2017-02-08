import * as React from 'react'
import * as Relay from 'react-relay'
import {Viewer, Seat} from '../../../types/types'
import EmptyRow from './EmptyRow'
import MemberRow from './MemberRow'
import DeleteCollaboratorMutation from '../../../mutations/DeleteCollaboratorMutation'
import {ShowNotificationCallback} from '../../../types/utils'
import {connect} from 'react-redux'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'

interface Props {
  viewer: Viewer
  showNotification: ShowNotificationCallback
}

class Team extends React.Component<Props, {}> {

  availableSeats: number = 2

  render() {

    const seats = this.props.viewer.project.seats.edges.map(edge => edge.node)

    const numberOfEmptyRows = this.availableSeats - seats.length

    let numbers = []
    for (let i = 0; i < numberOfEmptyRows; i++) {
      numbers.push(i)
    }

    return (
      <div className='container'>
        <style jsx={true}>{`
          .container {
            @inherit: .br, .ph38, .pt60;
            max-width: 700px;
            border-color: rgba( 229, 229, 229, 1);
          }
        `}</style>
        {seats.map(seat =>
          (<MemberRow
            key={seat.email}
            seat={seat}
            onDelete={this.deleteSeat}
          />),
        )}
        <div className='mt38'>
          {numbers.map((i) => (
            <EmptyRow
              key={i}
              hasAddFunctionality={i === 0}
              numberOfLeftSeats={i === 0 && numberOfEmptyRows}
              projectId={i === 0 && this.props.viewer.project.id}
            />
          ))}
        </div>
      </div>
    )
  }

  private deleteSeat = (seat: Seat) => {
    if (window.confirm('Do you really want to remove the user with email ' +
        seat.email + ' as a collaborator from this project?')) {
      Relay.Store.commitUpdate(
        new DeleteCollaboratorMutation({
          projectId: this.props.viewer.project.id,
          email: seat.email,
        }),
        {
          onSuccess: () => {
            this.props.showNotification({message: 'Removed collaborator with email: ' + seat.email, level: 'success'})
          },
          onFailure: (transaction) => {
            this.props.showNotification({message: transaction.getError().message, level: 'error'})
          },
        },
      )
    }
  }

}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const mappedTeam = connect(null, mapDispatchToProps)(Team)

export default Relay.createContainer(mappedTeam, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
          seats(first: 1000) {
            edges {
              node {
                id
                name
                email
                isOwner
                status
              }
            }
          }
        }
      }
    `,
  },
})
