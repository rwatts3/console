import * as React from 'react'
import * as Relay from 'react-relay'
import { Link } from 'react-router'
import { Viewer } from '../../types/types'
import Icon from '../../components/Icon/Icon'
// import ApiLayover from '../../components/ApiLayover/ApiLayover'
const ClickOutside: any = (require('react-click-outside') as any).default
import * as cookiestore from '../../utils/cookiestore'
const classes: any = require('./Header.scss')

interface Props {
  children: Element
  viewer: Viewer
  params: any
  projectId: string
}

interface State {
  userDropdownVisible: boolean
  endpointLayoverVisible: boolean
}

class Header extends React.Component<Props, State> {

  state = {
    userDropdownVisible: false,
    endpointLayoverVisible: false,
  }

  _openUserDropdown = () => {
    this.setState({ userDropdownVisible: true } as State)
  }

  _closeUserDropdown = () => {
    this.setState({ userDropdownVisible: false } as State)
  }

  _logout () {
    analytics.track('header: logout', () => {
      analytics.reset()
      cookiestore.remove('graphcool_token')
      cookiestore.remove('graphcool_user_id')
      window.localStorage.clear()
      window.location.pathname = '/'
    })
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.left}>
          {this.props.children}
          {/*{this.state.endpointLayoverVisible &&*/}
            {/*<ApiLayover*/}
              {/*projectId={this.props.projectId}*/}
              {/*close={() => this.setState({ endpointLayoverVisible: false } as State)}*/}
            {/*/>*/}
          {/*}*/}
          {/*<a*/}
            {/*className={classes.item}*/}
            {/*target='_blank'*/}
            {/*href='http://docs.graph.cool'*/}
          {/*>*/}
            {/*Docs*/}
          {/*</a>*/}
          {/*<span*/}
            {/*className={classes.item}*/}
            {/*onClick={() => this.setState({ endpointLayoverVisible: !this.state.endpointLayoverVisible } as State)}*/}
          {/*>*/}
            {/*API Endpoint*/}
          {/*</span>*/}
        </div>
        {this.state.userDropdownVisible &&
          <ClickOutside onClickOutside={(e) => {
            e.stopPropagation()
            this._closeUserDropdown()
          }}>
            <div className={classes.userDropdown}>
              <Link
                to={`/${this.props.params.projectName}/account`}
                onClick={this._closeUserDropdown}
              >
                Account
              </Link>
              <div onClick={this._logout}>
                Logout
              </div>
            </div>
          </ClickOutside>
        }
        <div className={classes.right} onClick={this._openUserDropdown}>
          {this.props.viewer.user.name}
          <Icon
            width={11}
            height={6}
            src={require('assets/icons/arrow.svg')}
          />
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(Header, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          name
        }
      }
    `,
  },
})
