import * as React from 'react'
import * as Immutable from 'immutable'
// import * as ReactDOM from 'react-dom'
import * as Relay from 'react-relay'
import {withRouter, Link} from 'react-router'
import {connect} from 'react-redux'
import cuid from 'cuid'
import * as PureRenderMixin from 'react-addons-pure-render-mixin'
import mapProps from '../../components/MapProps/MapProps'
// import {validateModelName} from '../../utils/nameValidator'
import ScrollBox from '../../components/ScrollBox/ScrollBox'
import Tether from '../../components/Tether/Tether'
import AddModelMutation from '../../mutations/AddModelMutation'
import {sideNavSyncer} from '../../utils/sideNavSyncer'
import {onFailureShowNotification} from '../../utils/relay'
import {nextStep, showDonePopup} from '../../actions/gettingStarted'
import {showPopup} from '../../actions/popup'
import {Project, Viewer, Model} from '../../types/types'
import {ShowNotificationCallback} from '../../types/utils'
import {showNotification} from '../../actions/notification'
import {Popup} from '../../types/popup'
import {GettingStartedState} from '../../types/gettingStarted'
import EndpointPopup from './EndpointPopup'
import AddModelPopup from './AddModelPopup'
import styled from 'styled-components'
import * as cx from 'classnames'
import {$p, variables, Icon} from 'graphcool-styles'
import { ExcludeProps } from '../../utils/components'
import tracker from '../../utils/metrics'
import {ConsoleEvents} from 'graphcool-metrics'

interface Props {
  params: any
  project: Project
  projectCount: number
  viewer: Viewer
  relay: Relay.RelayProp
  models: Model[]
  gettingStartedState: GettingStartedState
  nextStep: () => Promise<any>
  skip: () => Promise<any>
  showNotification: ShowNotificationCallback
  router: ReactRouter.InjectedRouter
  showDonePopup: () => void
  showPopup: (popup: Popup) => void
  itemCount: number
  countChanges: Immutable.Map<string, number>
  isBetaCustomer: boolean
}

interface State {
  forceShowModels: boolean
  addingNewModel: boolean
  newModelName: string
  newModelIsValid: boolean
  modelsExpanded: boolean
  modelsFit: boolean
}

// Section (Models, Relations, Permissions, etc.)

const Section = styled.div`
  padding: ${variables.size38} 0 0;

  &:last-child {
    margin-bottom: ${variables.size38}
  }
`

// Section Heads

const activeHead = `
  color: ${variables.white};

  svg {
    fill: ${variables.white};
    stroke: none !important;
  }

  &:hover {
    color: inherit;

    svg {
      fill: ${variables.white};
      stroke: none !important;
    }
  }

`

const Head = styled(ExcludeProps(Link, ['active']))`
  letter-spacing: 1px;
  line-height: 1;
  padding: 0 ${variables.size25};
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-weight: 600;
  color: ${variables.white60};
  transition: color ${variables.duration} linear;

  &:hover {
    color: ${variables.white80};

    svg {
      fill: ${variables.white80};
      stroke: none !important;
    }
  }

  > div {
    line-height: 1;
    margin-left: ${variables.size10};
  }

  svg {
    fill: ${variables.white60};
    stroke: none !important;
    transition: fill ${variables.duration} linear;
  }

  ${props => props.active && activeHead}
`

const footerSectionStyle = `
  display: flex;
  align-items: center;
  padding: ${variables.size25};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${variables.white60};
  cursor: pointer;
  transition: color ${variables.duration} linear;

  > div {
    margin-left: ${variables.size10};
  }

  svg {
    fill: ${variables.white60};
    transition: fill ${variables.duration} linear

  }

  &:hover {
    color: ${variables.white80};
    svg {
      fill: ${variables.white80};
    }
  }
`
const FooterSection = styled.div`${footerSectionStyle}`
const FooterLink = styled.a`${footerSectionStyle}`

export class SideNav extends React.Component<Props, State> {

  refs: {
    [key: string]: any;
    newModelInput: HTMLInputElement
  }

  shouldComponentUpdate: any

  constructor(props) {
    super(props)
    this.state = {
      forceShowModels: false,
      addingNewModel: false,
      newModelName: '',
      newModelIsValid: true,
      modelsExpanded: false,
      modelsFit: true,
    }
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  componentDidMount() {
    // subscribe to sideNavSyncer - THIS IS A HACK
    sideNavSyncer.setCallback(this.fetch, this)
    this.setModelsFit()
    window.addEventListener('resize', this.setModelsFit)
  }

  componentWillUnmount() {
    // unsubscribe from sideNavSyncer - THIS IS A HACK
    sideNavSyncer.setCallback(null, null)
    window.removeEventListener('resize', this.setModelsFit)
  }

  componentDidUpdate(prevProps) {
    if (this.props.models.length !== prevProps.models.length) {
      this.setModelsFit()
    }
  }

  render() {
    const {isBetaCustomer} = this.props
    return (
      <div
        className={cx(
          $p.relative,
          $p.w100,
          $p.h100,
          $p.white,
          $p.bgDarkBlue,
          $p.f14,
        )}
        onMouseLeave={() => this.setState({forceShowModels: false} as State)}
      >
        <div className={cx($p.h100)} style={{ paddingBottom: '70px' }}>
          <ScrollBox>
            {this.renderModels()}
            {this.renderRelations()}
            {this.renderPermissions()}
            {this.renderActions()}
            {this.renderPlayground()}
            {this.renderIntegrations()}
          </ScrollBox>
        </div>
        <div
          className={cx(
            $p.absolute,
            $p.w100,
            $p.bottom0,
            $p.flex,
            $p.itemsCenter,
            $p.justifyBetween,
            $p.bgDarkerBlue,
            $p.white60,
          )}
          style={{ height: '70px' }}
        >
          <FooterSection onClick={this.showEndpointPopup}>
            <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/endpoints.svg')}/>
            <div>Endpoints</div>
          </FooterSection>
          <FooterLink
            href='https://graph.cool/docs'
            target='_blank'
            onClick={() => {
              tracker.track(ConsoleEvents.Sidenav.docsOpened())
            }}
          >
            <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/docs.svg')}/>
            <div>Docs</div>
          </FooterLink>
        </div>
      </div>
    )
  }

  private renderPlayground = () => {
    const playgroundPageActive = this.props.router.isActive(`/${this.props.params.projectName}/playground`)
    const showGettingStartedOnboardingPopup = () => {
      if (this.props.gettingStartedState.isCurrentStep('STEP4_CLICK_PLAYGROUND')) {
        this.props.nextStep()
      }
    }

    return (
      <Section>
        <Head
          to={`/${this.props.params.projectName}/playground`}
          active={playgroundPageActive}
          onClick={showGettingStartedOnboardingPopup}
        >
          <Icon
            width={20}
            height={20}
            src={require('graphcool-styles/icons/fill/playground.svg')}
          />
          <Tether
            side='top'
            steps={[{
                step: 'STEP4_CLICK_PLAYGROUND',
                title: 'Open the Playground',
                description: 'Now that we have defined our data model and added example data it\'s time to send some queries to our backend!', // tslint:disable-line
              }]}
            offsetY={-20}
            width={280}
          >
            <div>Playground</div>
          </Tether>
        </Head>
      </Section>
    )
  }

  private renderActions = () => {
    const actionsPageActive = this.props.router.isActive(`/${this.props.params.projectName}/actions`)
    return (
      <Section>
        <Head
          to={`/${this.props.params.projectName}/actions`}
          active={actionsPageActive}
        >
          <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/actions.svg')}/>
          <div>Mutation Callbacks</div>
        </Head>
      </Section>
    )
  }

 private renderPermissions = () => {
   const permissionsPageActive = this.props.router.isActive(`/${this.props.params.projectName}/permissions`)
   return (
     <Section>
       <Head
         to={`/${this.props.params.projectName}/permissions`}
         active={permissionsPageActive}
       >
         <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/permissions.svg')}/>
         <div>Permissions</div>
       </Head>
     </Section>
   )
 }

  private renderIntegrations = () => {
    const integrationsPageActive = this.props.router.isActive(`/${this.props.params.projectName}/integrations`)
    return (
      <Section>
        <Head
          to={`/${this.props.params.projectName}/integrations`}
          active={integrationsPageActive}
        >
          <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/integrations.svg')}/>
          <div>Integrations</div>
        </Head>
      </Section>
    )
  }

  private renderRelations = () => {
    const relationsPageActive = this.props.router.isActive(`/${this.props.params.projectName}/relations`)

    const activeRelationsHead = `
      svg {
        fill: none;
        stroke: ${variables.white} !important;
      }

      &:hover {
        svg {
          stroke: ${variables.white} !important;
        }
      }
    `

    const RelationsHead = styled(Head)`
      svg {
        fill: none;
        stroke: ${variables.white60} !important;
        stroke-width: 4px !important;
        transition: stroke ${variables.duration} linear;
      }

      &:hover {
        svg {
          fill: none;
          stroke: ${variables.white80} !important;
        }
      }

      ${props => props.active && activeRelationsHead}
    `

    return (
      <Section>
        <RelationsHead
          to={`/${this.props.params.projectName}/relations`}
          active={relationsPageActive}
        >
          <Icon width={20} height={20} stroke src={require('graphcool-styles/icons/stroke/relationsSmall.svg')}/>
          <div>Relations</div>
        </RelationsHead>
      </Section>
    )
  }

  private setModelsFit = () => {
    const HEADER_HEIGHT = 64
    const FOOTER_HEIGHT = 70

    const MODEL_MARGIN_TOP = 68
    const MODEL_HEIGHT = 36
    const numModels = this.props.models.length
    const MODEL_MARGIN_BOTTOM = 38

    const NUM_LINKS = 4
    const LINK_HEIGHT = 58
    const LINKS_MARGIN = 38

    const height = window.innerHeight

    const fit = height > (
      HEADER_HEIGHT +
      FOOTER_HEIGHT +
      MODEL_MARGIN_TOP +
      MODEL_HEIGHT * numModels +
      MODEL_MARGIN_BOTTOM +
      NUM_LINKS * LINK_HEIGHT +
      LINKS_MARGIN
    )

    this.setState({modelsFit: fit} as State)
  }

  private renderModels = () => {
    const modelActive = (model) => (
      this.props.router.isActive(`/${this.props.params.projectName}/models/${model.name}/schema`) ||
      this.props.router.isActive(`/${this.props.params.projectName}/models/${model.name}/databrowser`)
    )

    // const modelsPageActive = this.props.router.isActive(`/${this.props.params.projectName}/models`)
    // const showsModels = modelsPageActive || this.state.forceShowModels

    const ModelsHead = styled(Head)`
      &:hover {
        color: ${variables.white60};
        cursor: default;
      }
    `

    const AddModel = styled.div`
      margin: -3px -4px 0 0;

      svg {
        stroke: ${variables.white};
        stroke-width: 4px;
      }
    `

    const turnedToggleMore = `
      i {
        transform: rotate(180deg) !important;
        svg {
          position: relative;
          top: 1px;
        }
      }
    `

    const ToggleMore = styled.div`
      height: ${variables.size60};
      background: linear-gradient(to bottom, ${variables.darkerBlue0} 0%, ${variables.darkerBlue} 80%);

      svg {
        stroke-width: 4px;
        fill: none;
      }

      ${props => props.turned && turnedToggleMore}
    `

    const activeListElement = `
      color: ${variables.white} !important;
      background: ${variables.white07};
      cursor: default;

      &:before {
        content: "";
        position: absolute;
        top: -1px;
        bottom: -1px;
        left: 0;
        width: ${variables.size06};
        background: ${variables.green};
        border-radius: 0 2px 2px 0;
      }

      &:hover {
        color: inherit;
      }
    `
    const ListElement = styled(ExcludeProps(Link, ['active']))`
      transition: color ${variables.duration} linear;

      &:hover {
         color: ${variables.white60};
      }

      ${props => props.active && activeListElement}
    `

    return (
      <Section className={cx(
        $p.relative,
        $p.bgDarkerBlue,
      )}>
        <ModelsHead>
          Models
        </ModelsHead>
        <div
          className={cx($p.overflowHidden)}
          style={{
            height: this.state.modelsFit
              ? 'auto' : (this.state.modelsExpanded ? 76 + 41 * this.props.models.length : window.innerHeight - 456),
            transition: 'height .5s ease',
          }}
        >
          <div
            className={cx(
              $p.flex,
              $p.flexColumn,
              $p.pt16,
              this.state.modelsFit ? $p.pb38 : $p.pb60,
            )}
          >
            {this.props.models && this.props.models.map((model) => (
              <ListElement
                key={model.name}
                to={`/${this.props.params.projectName}/models/${model.name}`}
                active={modelActive(model)}
                className={cx(
                $p.relative,
                $p.pv10,
                $p.fw6,
                $p.white30,
                $p.ph25,
                $p.flex,
                $p.justifyBetween,
              )}>
                <div className={cx($p.pl6, $p.mra, $p.flex, $p.flexRow, $p.itemsCenter)}>
                  <div>{model.name}</div>
                  {model.isSystem && (
                    <div
                      className={cx($p.ph4, $p.br2, $p.bgWhite20, $p.darkerBlue, $p.ttu, $p.f12, $p.ml10)}
                    >System</div>
                  )}
                </div>
                <div>{model.itemCount + (this.props.countChanges.get(model.id) || 0)}</div>
              </ListElement>
            ))}
          </div>

        </div>

        <AddModel
          className={cx(
            $p.absolute,
            $p.top38,
            $p.right25,
            $p.lhSolid,
            $p.ba,
            $p.brPill,
            $p.bWhite,
            $p.pointer,
            $p.o60,
          )}
          onClick={this.showAddModelPopup}
        >
          <Tether
            steps={[{
              step: 'STEP1_CREATE_POST_MODEL',
              title: 'Create a Model called "Post"',
              description: 'Models represent a certain type of data. To manage our Instagram posts, the "Post" model will have an image URL and a description.', // tslint:disable-line
            }]}
            offsetY={-5}
            offsetX={-13}
            width={350}
            style={{
              pointerEvents: 'none',
            }}
          >
            <Icon width={18} height={18} stroke src={require('graphcool-styles/icons/stroke/add.svg')}/>
          </Tether>
        </AddModel>
        {!this.state.modelsFit &&
          <ToggleMore
            onClick={() => this.setState({modelsExpanded: !this.state.modelsExpanded} as State )}
            className={cx(
              $p.absolute,
              $p.bottom0,
              $p.left0,
              $p.w100,
              $p.flex,
              $p.justifyCenter,
              $p.itemsCenter,
              $p.pointer,
            )}
            turned={this.state.modelsExpanded}
          >
            <Icon
              width={18}
              height={18}
              stroke
              color={variables.white}
              src={require('graphcool-styles/icons/stroke/arrowDown.svg')}
              onClick={this.toggleModels}
              className={cx(
                $p.brPill,
                $p.bgDarkBlue,
              )}
            />
          </ToggleMore>
        }
      </Section>
    )
  }

  // private handleNewModelChange = (e) => {
  //   this.setState({
  //     newModelName: e.target.value,
  //     newModelIsValid: e.target.value === '' ? true : validateModelName(e.target.value),
  //   } as State)
  // }
  //
  // private handleNewModelKeyDown = (e) => {
  //   if (e.keyCode === 13) {
  //     this.addModel()
  //   }
  // }

  private toggleModels = () => {
    const { modelsExpanded } = this.state
    this.setState({modelsExpanded: !modelsExpanded} as State)
  }

  private fetch = () => {
    // the backend might cache the force fetch requests, resulting in potentially inconsistent responses
    this.props.relay.forceFetch()
  }
  //
  // private toggleAddModelInput = () => {
  //   if (this.state.addingNewModel && this.state.newModelIsValid) {
  //     this.addModel()
  //   }
  //
  //   this.setState(
  //     {
  //       addingNewModel: !this.state.addingNewModel,
  //     } as State,
  //     () => {
  //       if (this.state.addingNewModel) {
  //         ReactDOM.findDOMNode<HTMLInputElement>(this.refs.newModelInput).focus()
  //       }
  //     }
  //   )
  // }

  private addModel = (modelName: string) => {
    const redirect = () => {
      this.props.router.push(`/${this.props.params.projectName}/models/${modelName}`)
      this.setState({
        addingNewModel: false,
        newModelIsValid: true,
      } as State)
    }

    if (modelName) {
      Relay.Store.commitUpdate(
        new AddModelMutation({
          modelName,
          projectId: this.props.project.id,
        }),
        {
          onSuccess: () => {
            tracker.track(ConsoleEvents.Schema.Model.created({modelName}))
            if (
              modelName === 'Post' &&
              this.props.gettingStartedState.isCurrentStep('STEP1_CREATE_POST_MODEL')
            ) {
              this.props.showDonePopup()
              this.props.nextStep().then(redirect)
            } else {
              redirect()
            }
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
          },
        },
      )
    }
  }

  private showEndpointPopup = () => {
    const id = cuid()
    this.props.showPopup({
      element: <EndpointPopup id={id} projectId={this.props.project.id} />,
      id,
    })
  }

  private showAddModelPopup = () => {
    const id = cuid()
    this.props.showPopup({
      element: <AddModelPopup id={id} saveModel={this.saveModel} />,
      id,
    })
  }

  private saveModel = (modelName: string) => {
    this.addModel(modelName)
  }
}

const ReduxContainer = connect(
  state => ({
    gettingStartedState: state.gettingStarted.gettingStartedState,
    itemCount: state.databrowser.data.itemCount,
    countChanges: state.databrowser.data.countChanges,
  }),
  {
    nextStep,
    showDonePopup,
    showNotification,
    showPopup,
  },
)(withRouter(SideNav))

const MappedSideNav = mapProps({
  params: (props) => props.params,
  project: (props) => props.project,
  relay: (props) => props.relay,
  models: (props) => props.project.models.edges
    .map((edge) => edge.node)
    .sort((a, b) => a.name.localeCompare(b.name)),
  isBetaCustomer: props =>
    props.viewer &&
    props.viewer.user &&
    props.viewer.user.crm &&
    props.viewer.user.crm.information &&
    props.viewer.user.crm.information.isBeta || false,
})(ReduxContainer)

export default Relay.createContainer(MappedSideNav, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          crm {
            information {
              isBeta
            }
          }
        }
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        name
        webhookUrl
        models(first: 100) {
          edges {
            node {
              id
              name
              itemCount
              isSystem
            }
          }
        }
      }
    `,
  },
})
