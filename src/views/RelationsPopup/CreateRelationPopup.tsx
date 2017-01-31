import * as React from 'react'
import * as Relay from 'react-relay'
import {RelationPopupDisplayState, Viewer} from '../../types/types'
import CreateRelationHeader from './CreateRelationHeader'
import PopupWrapper from '../../components/PopupWrapper/PopupWrapper'
import {withRouter} from 'react-router'
import CreateRelationFooter from './CreateRelationFooter'
import DefineRelation from './DefineRelation'
import SetMutation from './SetMutation'

interface State {
  displayState: RelationPopupDisplayState
}

interface Props {
  router: ReactRouter.InjectedRouter
  viewer: Viewer
}

class CreateRelationPopup extends React.Component<Props, State> {

  state = {
    displayState: 'DEFINE_RELATION' as RelationPopupDisplayState,
    // displayState: 'SET_MUTATIONS' as RelationPopupDisplayState,
  }

  render() {

    const models = this.props.viewer.project.models.edges.map(edge => edge.node)

    return (
      <PopupWrapper onClickOutside={this.close}>
        <style jsx={true}>{`
          .content {
            @inherit: .buttonShadow;
            width: 700px;
          }
        `}</style>
        <div className='flex itemsCenter justifyCenter w100 h100'>
          <div className='content'>
            <div className='flex flexColumn justifyBetween h100'>
              <div>
                <CreateRelationHeader
                  displayState={this.state.displayState}
                  switchDisplayState={this.switchToDisplayState}
                />
                {
                  this.state.displayState === 'DEFINE_RELATION' ?
                    <DefineRelation
                      models={models}
                    />
                    :
                    <SetMutation />
                }
              </div>
              <CreateRelationFooter
                displayState={this.state.displayState}
                switchDisplayState={this.switchToDisplayState}
              />
            </div>
          </div>
        </div>
      </PopupWrapper>
    )
  }

  private close = () => {
    this.props.router.goBack()
  }

  private switchToDisplayState = (displayState: RelationPopupDisplayState) => {
    console.log('new display state: ', displayState)
    console.log(this.state)
    if (displayState !== this.state.displayState) {
      this.setState({displayState: displayState} as State)
    }
  }
}



export default Relay.createContainer(withRouter(CreateRelationPopup), {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          models(first: 1000) {
            edges {
              node {
                name
                namePlural
              }
            }
          }
        }
      }
    `,
  },
})
