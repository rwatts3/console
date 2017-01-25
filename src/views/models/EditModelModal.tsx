import * as React from 'react'
import Modal from '../../components/Modal'
import * as Relay from 'react-relay'
import {Model} from '../../types/types'


interface Props {
  isOpen: boolean
  contentLabel: string
  onRequestClose: Function
  model: Model
}

class EditModelModal extends React.Component<Props, {}> {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <Modal {...this.props}>
        {this.props.model.name}
      </Modal>
    )
  }
}


export default Relay.createContainer(EditModelModal, {
  fragments: {
    model: () => Relay.QL`
      
      fragment on Model {
        id
        name
      }
    `,
  },
})
