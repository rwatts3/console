import * as React from 'react'
import * as Relay from 'react-relay'
import {Seat} from '../../../types/types'

interface Props {
  seat: Seat
}

export default class MemberRow extends React.Component<Props, {}> {

  render() {
    return this.props.seat.status === 'JOINED' ?
          (
            <div className='flex itemsCenter ph16'>
              <style jsx={true}>{`
                .blue {
                  color: rgba(49,177,180,1);
                  background-color: rgba(49,177,180,.2);
                }

                .violet {
                  color: rgba(164,3,111,1);
                  background-color: rgba(164,3,111,.2);
                }

                .orange {
                  color: rgba(241,143,1,1);
                  background-color: rgba(241,143,1,.2);
                }

                .red {
                  color: rgba(242,92,84,1);
                  background-color: rgba(242,92,84,.2);
                }

              `}</style>
              <div className={`br100 fw6 f20 ${this.randomColor()}`}>{this.props.seat.name.charAt(0)}</div>
              <div className='pl16 black80 f25 fw3'>{this.props.seat.name}</div>
            </div>
          ) :
          (
            <div>Pending</div>
          )
  }

  private randomColor() : string {
    const colors = ['blueCircle', 'violetCircle', 'orangeCircle', 'redCircle']
    const random = Math.floor((Math.random() * 4) + 1)
    return colors[random]
  }

}
