import * as cookiestore from 'cookiestore'
import * as React from 'react'
import * as Relay from 'react-relay'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import Loading from './components/Loading/Loading'
import RedirectOnMount from './components/RedirectOnMount/RedirectOnMount'
import ActionsView from './views/ActionsView/ActionsView'
import LoginView from './views/LoginView/LoginView'
import ProjectRootView from './views/ProjectRootView/ProjectRootView'
import RootRedirectView from './views/ProjectRootView/RootRedirectView'
import TokenRedirectView from './views/ProjectRootView/TokenRedirectView'
import ProjectSettingsView from './views/ProjectSettingsView/ProjectSettingsView'
import RelationPopup from './views/RelationsView/RelationPopup'
import RelationsView from './views/RelationsView/RelationsView'
import RootView from './views/RootView/RootView'
import SignUpView from './views/SignUpView/SignUpView'
import AccountView from './views/account/AccountView/AccountView'
import SettingsTab from './views/account/AccountView/SettingsTab'
import ResetPasswordView from './views/account/ResetPasswordView/ResetPasswordView'
import DatabrowserView from './views/models/DatabrowserView/DatabrowserView'
import ModelRedirectView from './views/models/ModelRedirectView'
import FieldPopup from './views/models/SchemaView/FieldPopup'
import SchemaView from './views/models/SchemaView/SchemaView'
import PlaygroundView from './views/playground/PlaygroundView/PlaygroundView'
import PermissionsView from './views/PermissionsView/PermissionsView'
import { EditPermissionPopup, AddPermissionPopup } from './views/PermissionsView/PermissionPopup/PermissionPopup'
import CloneProjectPopup from './views/ProjectRootView/CloneProjectPopup'
import ShowRoom from './views/ShowRoom/ShowRoom'
import tracker from './utils/metrics'
import { ConsoleEvents } from 'graphcool-metrics'

const ViewerQuery = {
  viewer: (Component, variables) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer', variables)}
      }
    }
  `,
}

const NodeQuery = {
  node: (Component, variables) => Relay.QL`
    query {
      node: node(id: $id) {
        ${Component.getFragment('node', variables)}
      }
    }
  `,
}

/* eslint-disable react/prop-types */
const render = ({error, props, routerProps, element}) => {
  if (error) {
    const err = error.source.errors[0]

    tracker.track(ConsoleEvents.unexpectedError({error: JSON.stringify(err)}))

    if (err.code === 2001) {
      cookiestore.remove('graphcool_auth_token')
      cookiestore.remove('graphcool_customer_id')
      tracker.reset()

      return (
        <RedirectOnMount to='/login'/>
      )
    }

    if (routerProps && routerProps.params.projectName && routerProps.params.modelName) {
      // if we have a model and a project, there might be only a problem with the model, so redirect to project
      return (
        <RedirectOnMount to={`/${routerProps.params.projectName}`}/>
      )
    }

    return (
      // TODO https://github.com/relay-tools/react-router-relay/issues/156
      <RedirectOnMount to='/'/>
    )
  }

  if (props) {
    return React.cloneElement(element, props)
  }

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Loading color='#8989B1'/>
    </div>
  )
}
/* eslint-enable react/prop-types */

export default (
  <Route path='/' component={RootView}>
    <IndexRoute component={RootRedirectView} queries={ViewerQuery} render={render}/>
    <Route path='token' component={TokenRedirectView}/>
    <Route path='login' component={LoginView} render={render}/>
    <Route path='reset-password' component={ResetPasswordView}/>
    <Route path='signup' component={SignUpView}/>
    <Route path='showroom' component={ShowRoom}/>
    <Route path=':projectName' component={ProjectRootView} queries={ViewerQuery} render={render}>
      <Route path='clone' component={CloneProjectPopup} queries={ViewerQuery} render={render}/>
      <Route path='account' component={AccountView} queries={ViewerQuery} render={render}>
        <Route path='settings' component={SettingsTab} queries={ViewerQuery} render={render}/>
        <IndexRedirect to='settings'/>
      </Route>
      <Route path='models'>
        <IndexRoute component={ModelRedirectView} queries={ViewerQuery} render={render}/>
        <Route path=':modelName/schema' component={SchemaView} queries={ViewerQuery} render={render}>
          <Route path='edit/:fieldName' component={FieldPopup} queries={ViewerQuery} render={render}/>
          <Route path='create' component={FieldPopup} queries={ViewerQuery} render={render}/>
        </Route>
        <Route path=':modelName/databrowser' component={DatabrowserView} queries={ViewerQuery} render={render}/>
        <Route path=':modelName' component={ModelRedirectView} queries={ViewerQuery} render={render}/>
      </Route>
      <Route path='permissions' component={PermissionsView} queries={ViewerQuery} render={render}>
        <Route
          path=':modelName/edit/:id'
          component={EditPermissionPopup}
          queries={{node: NodeQuery.node, viewer: ViewerQuery.viewer}}
          render={render}/>
        <Route path=':modelName/create' component={AddPermissionPopup} queries={ViewerQuery} render={render}/>
      </Route>
      <Route path='relations' component={RelationsView} queries={ViewerQuery} render={render}>
        <Route path='create' component={RelationPopup} queries={ViewerQuery} render={render}/>
        <Route path='edit/:relationName' component={RelationPopup} queries={ViewerQuery} render={render}/>
      </Route>
      <Route path='actions' component={ActionsView} queries={ViewerQuery} render={render}/>
      <Route path='playground' component={PlaygroundView} queries={ViewerQuery} render={render}/>
      <Route path='settings' component={ProjectSettingsView} queries={ViewerQuery} render={render}/>
      <IndexRedirect to='models'/>
    </Route>
  </Route>
)
