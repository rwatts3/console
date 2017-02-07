import * as React from 'react'

interface Props {
  seats: string[]
  maxSeats: number
}

export default class Seats extends React.Component<Props, {}> {

  render() {
    return (
      <div className='flex mv38 itemsCenter'>
        {this.usedSeats()}
        {this.freeSeats()}
        <div className='ml6 f14 green fw6'>{this.props.seats.length}</div>
        <div className='ml6 f14 black50'> / {this.props.maxSeats} seats</div>
      </div>
    )
  }

  private usedSeats = (): JSX.Element => {
    return (
      <div className='flex'>
        {this.props.seats.map((name, i) => {
          return (<div
            key={i}
            className='flex itemsCenter justifyCenter mr4 bgLightgreen20 green br100 fw7 f14'
            style={{width: '22px', height: '22px', marginTop: -2}}
          >{name.charAt(0)}</div>)
        })}
      </div>
    )
  }

  private freeSeats = (): JSX.Element => {

    const numberOfEmptyRows = this.props.maxSeats - this.props.seats.length

    let numbers = []
    for (let i = 0; i < numberOfEmptyRows; i++) {
      numbers.push(i)
    }

    return (
      <div className='flex'>
        {numbers.map((i) => {
          return (<div
            key={i}
            className='mr4 bgBlack07 br100'
            style={{width: '20px', height: '20px'}}
           />)
        })}
      </div>
    )
  }

}
