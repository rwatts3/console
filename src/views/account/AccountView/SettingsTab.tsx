import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Viewer } from '../../../types/types'
import UpdateCustomerInformationMutation from '../../../mutations/UpdateCustomerInformationMutation'
import { onFailureShowNotification } from '../../../utils/relay'
import { ShowNotificationCallback } from '../../../types/utils'
import { showNotification } from '../../../actions/notification'
const classes: any = require('./SettingsTab.scss')

interface Props {
  params: any
  viewer: Viewer
  showNotification: ShowNotificationCallback
}

interface State {
  email: string
  name: string
  oldPassword: string
  newPasswordOne: string
  newPasswordTwo: string
  showPassword: boolean
}

class SettingsTab extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const authProvider = window.localStorage.getItem('graphcool_auth_provider')

    this.state = {
      email: this.props.viewer.user.crm.information.email,
      name: this.props.viewer.user.crm.information.name,
      oldPassword: '',
      newPasswordOne: '',
      newPasswordTwo: '',
      showPassword: authProvider && authProvider.includes('auth0'),
    }
  }

  render() {
    return (
      <div className={classes.root}>
        <div className={classes.category}>
          <div className={classes.title}>Email</div>
          <div className="darkBlue80 mt10">
            {this.props.viewer.user.crm.information.email}
          </div>
        </div>
        <div className={classes.category}>
          <div className={classes.title}>Name</div>
          <input
            type="text"
            placeholder="Your name"
            value={this.state.name}
            className={classes.field}
            onChange={(e: any) =>
              this.setState({ name: e.target.value } as State)}
          />
        </div>
        <div className={classes.saveChanges} onClick={this.saveChanges}>
          Save changes
        </div>
      </div>
    )
  }

  private saveChanges = () => {
    const nameWasChanged =
      this.props.viewer.user.crm.information.name !== this.state.name
    const emailWasChanged =
      this.props.viewer.user.crm.information.email !== this.state.email
    const passwordWasChanged =
      this.state.newPasswordOne !== '' && this.state.newPasswordTwo !== ''

    if (!nameWasChanged && !emailWasChanged && !passwordWasChanged) {
      this.props.showNotification({
        message: 'No changes to save...',
        level: 'info',
      })
    }

    if (nameWasChanged || emailWasChanged) {
      this.handleCustomerChange()
    }
  }

  private handleCustomerChange() {
    UpdateCustomerInformationMutation.commit({
      customerInformationId: this.props.viewer.user.crm.information.id,
      email: this.state.email,
      name: this.state.name,
    })
      .then(() => {
        this.props.showNotification({
          message: 'Changes to email and name were saved.',
          level: 'success',
        })
      })
      .catch(transaction => {
        onFailureShowNotification(transaction, this.props.showNotification)
      })
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ showNotification }, dispatch)
}

const MappedSettingsTab = connect(null, mapDispatchToProps)(SettingsTab)

export default createFragmentContainer(MappedSettingsTab, {
  viewer: graphql`
    fragment SettingsTab_viewer on Viewer {
      user {
        id
        crm {
          information {
            id
            name
            email
          }
        }
      }
    }
  `,
})
