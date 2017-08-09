import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import Helmet from 'react-helmet'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import { Viewer, Project } from '../../../types/types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cookiestore from 'cookiestore'
import { sideNavSyncer } from '../../../utils/sideNavSyncer'
import { GettingStartedState } from '../../../types/gettingStarted'
import { nextStep, previousStep } from '../../../actions/gettingStarted'
const classes: any = require('./PlaygroundView.scss')
import { Popup } from '../../../types/popup'
import { showPopup } from '../../../actions/popup'
import tracker from '../../../utils/metrics'
import { ConsoleEvents } from 'graphcool-metrics'
import Playground from 'graphcool-graphiql'
import getSubscriptionEndpoint from '../../../utils/region'
import Tether from '../../../components/Tether/Tether'

interface Props {
  viewer: Viewer & { project: Project; userModel: any }
  params: any
  gettingStartedState: GettingStartedState
  nextStep: () => any
  previousStep: () => any
  showPopup: (popup: Popup) => void
}
interface State {
  adminToken: string
}

class PlaygroundView extends React.Component<Props, State> {
  private lokka: any
  private guestLokka: any

  constructor(props: Props) {
    super(props)

    const clientEndpoint = `${__BACKEND_ADDR__}/relay/v1/${this.props.viewer
      .project.id}`
    const token = cookiestore.get('graphcool_auth_token')
    const headers = {
      Authorization: `Bearer ${token}`,
      'x-graphcool-source': 'console:playground:user-list',
    }
    const transport = new Transport(clientEndpoint, { headers })
    const guestTransport = new Transport(clientEndpoint)

    this.lokka = new Lokka({ transport })
    this.guestLokka = new Lokka({ transport: guestTransport })

    this.state = {
      adminToken: token,
    }
  }

  componentDidMount() {
    tracker.track(ConsoleEvents.Playground.viewed())
  }

  handleResponse = (graphQLParams, response) => {
    if (!response.ok && !graphQLParams.query.includes('IntrospectionQuery')) {
      tracker.track(ConsoleEvents.Playground.queryRan({ type: 'Fail' }))
    }
    if (response.ok && !graphQLParams.query.includes('IntrospectionQuery')) {
      tracker.track(ConsoleEvents.Playground.queryRan({ type: 'Success' }))
    }

    if (graphQLParams.query.includes('mutation')) {
      // update side nav item count when we did a mutation
      sideNavSyncer.notifySideNav()
    }
  }

  render() {
    const { project } = this.props.viewer
    const subscriptionsEndpoint = getSubscriptionEndpoint(project.region)
    const step = this.props.gettingStartedState.skipped
      ? undefined
      : this.props.gettingStartedState.step

    return (
      <div className={classes.root}>
        <Helmet title="Playground" />
        <style jsx={true}>{`
          div :global(.onboarding-hint) {
            @p: .pa0, .bgNone;
          }
        `}</style>
        <Playground
          adminAuthToken={this.state.adminToken}
          projectId={this.props.viewer.project.id}
          onSuccess={this.handleResponse}
          httpApiPrefix={__BACKEND_ADDR__}
          wsApiPrefix={subscriptionsEndpoint + '/v1'}
          onboardingStep={step}
          tether={Tether}
          nextStep={this.props.nextStep}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ nextStep, previousStep, showPopup }, dispatch)
}

const MappedPlaygroundView = connect(mapStateToProps, mapDispatchToProps)(
  PlaygroundView,
)

export default createFragmentContainer(MappedPlaygroundView, {
  viewer: graphql`
    fragment PlaygroundView_viewer on Viewer {
      project: projectByName(projectName: $projectName) {
        id
        region
      }
      userModel: modelByName(projectName: $projectName, modelName: "User") {
        id
      }
    }
  `,
})
