import * as React from 'react'
import {Relation} from '../../../types/types'
import NewToggleButton from '../../../components/NewToggleButton/NewToggleButton'

interface Props {
  relation: Relation
  connect: boolean
  disconnect: boolean
  toggleConnect: () => void
  toggleDisconnect: () => void
}

export default function RelationBaseSettings({connect, disconnect, toggleConnect, toggleDisconnect}: Props) {
  return (
    <div className='relation-base-settings'>
      <style jsx={true}>{`

      `}</style>

      <div className='flex'>
        <div className="label">Connect</div>
        <NewToggleButton defaultChecked={connect} onChange={toggleConnect} />
      </div>
      <div className='flex'>
        <div className="label">Disconnect</div>
        <NewToggleButton defaultChecked={disconnect} onChange={toggleDisconnect} />
      </div>
    </div>
  )
}
