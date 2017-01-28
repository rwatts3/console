import * as React from 'react'
import * as Relay from 'react-relay'
import {Seat} from '../../../types/types'

interface Props {
  seat: Seat
}

export default class MemberRow extends React.Component<Props, {}> {

  colors = ['blueCircle', 'violetCircle', 'orangeCircle', 'redCircle', 'greenCircle']

  render() {
    return this.props.seat.status === 'JOINED' ?
          (
            <div className='container'>
              <style jsx={true}>{`

                .container {
                  @inherit: .flex, .itemsCenter, .ph16, .mb16;
                  height: 69px;
                }

                .blueCircle {
                  color: rgba(49,177,180,1);
                  background-color: rgba(49,177,180,.2);
                }

                .violetCircle {
                  color: rgba(164,3,111,1);
                  background-color: rgba(164,3,111,.2);
                }

                .orangeCircle {
                  color: rgba(241,143,1,1);
                  background-color: rgba(241,143,1,.2);
                }

                .redCircle {
                  color: rgba(242,92,84,1);
                  background-color: rgba(242,92,84,.2);
                }

                .greenCircle {
                  color: rgba(42,189,60,1);
                  background-color: rgba(42,189,60,.2);
                }

              `}</style>
              <div className='flex justifyBetween itemsCenter w100 ph10'>
                <div className='flex'>
                  <div className={`flex justifyCenter itemsCenter br100 wS38 hS38 fw6 f20 ${this.randomColor()}`}>
                    {this.props.seat.name.charAt(0)}</div>
                  <div className='pl16 black80 f25 fw3'>{this.props.seat.name}</div>
                  {this.isCurrentUser() && <div className='pl2 black50 f25 fw3'>(you)</div>}
                </div>
                {this.props.seat.isOwner &&
                  <div className='f14 fw6 ttu itemsStart green bgLightgreen20 br2 pv2 ph6'>Owner</div>
                }
              </div>
            </div>
          ) :
          (
            <div className='flex justifyBetween itemsCenter w100 ph10 mb16'>
              <div className='f25 fw3 black50'>{this.props.seat.email}</div>
              <div className='ttu lightOrange f14'>Pending</div>
            </div>
          )
  }

  private randomColor(): string {
    const random = Math.floor((Math.random() * 4) + 1)
    return this.colors[random]
  }

  private isCurrentUser(): boolean {
    return false
  }

}
