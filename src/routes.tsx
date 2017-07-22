import * as cookiestore from 'cookiestore'
import * as React from 'react'
import {graphql} from 'react-relay'
import * as Relay from 'react-relay/classic'
// import { Route, IndexRoute, IndexRedirect, Redirect } from 'found'
import makeRouteConfig from 'found/lib/makeRouteConfig'
import Route from 'found/lib/Route'
import Redirect from 'found/lib/Redirect'

import Loading from './components/Loading/Loading'
import RedirectOnMount from './components/RedirectOnMount/RedirectOnMount'
// import ActionsView from './views/ActionsView/ActionsView'
import AuthView from './views/AuthView/AuthView'
// import CLIAuthView from './views/CLIAuthView/CLIAuthView/CLIAuthView'
// import CLIAuthSuccessInitView from './views/CLIAuthView/CLIAuthSuccessInitView/CLIAuthSuccessInitView'
// import CLIAuthSuccessView from './views/CLIAuthView/CLIAuthSuccessView'
import ProjectRootView from './views/ProjectRootView/ProjectRootView'
import RootRedirectView from './views/ProjectRootView/RootRedirectView'
// import TokenRedirectView from './views/ProjectRootView/TokenRedirectView'
// import ProjectSettingsView from './views/ProjectSettingsView/ProjectSettingsView'
import RootView from './views/RootView/RootView'
// import AfterSignUpView from './views/AfterSignUpView/AfterSignUpView'
// import AccountView from './views/account/AccountView/AccountView'
// import SettingsTab from './views/account/AccountView/SettingsTab'
// import ResetPasswordView from './views/account/ResetPasswordView/ResetPasswordView'
// import DatabrowserView from './views/models/DatabrowserView/DatabrowserView'
// import Settings from './views/Settings/Settings'
// import General from './views/Settings/General/General'
// import Authentication from './views/Settings/Authentication/Authentication'
// import Export from './views/Settings/Export/Export'
// import Team from './views/Settings/Team/Team'
// import Billing from './views/Settings/Billing/Billing'
// import ModelRedirectView from './views/models/ModelRedirectView'
// import FieldPopup from './views/models/FieldPopup/FieldPopup'
// import AuthProviderPopup from './views/models/AuthProviderPopup/AuthProviderPopup'
// import PlaygroundView from './views/playground/PlaygroundView/PlaygroundView'
// import PermissionsView from './views/PermissionsView/PermissionsView'
// import { EditPermissionPopup, AddPermissionPopup } from './views/PermissionsView/PermissionPopup/PermissionPopup'
// import {
//   EditRelationPermissionPopup,
//   AddRelationPermissionPopup,
// } from './views/PermissionsView/RelationPermissionPopup/RelationPermissionPopup'
// import CloneProjectPopup from './views/ProjectRootView/CloneProjectPopup'
// import AlgoliaView from './views/Integrations/Algolia/AlgoliaView'
import ShowRoom from './views/ShowRoom/ShowRoom'
// import IntegrationsView from './views/Integrations/IntegrationsView'
import tracker from './utils/metrics'
import { ConsoleEvents } from 'graphcool-metrics'
// import RelationPopup from './views/RelationsPopup/RelationPopup'
// import ChangePricingPlan from './views/Settings/Billing/ChangePricingPlan'
// import ConfirmPricingPlan from './views/Settings/Billing/ConfirmPricingPlan'
// import ImportSchemaView from './views/ImportSchemaView/ImportSchemaView'
// import NewSchemaView from './views/SchemaView/SchemaView'
// import SchemaViewer from './views/SchemaView/SchemaViewer'
// import AllRelationPermissionsList from './views/PermissionsView/RelationPermissionsList/AllRelationPermissionsList'
// import PermissionsList from './views/PermissionsView/PermissionsList/PermissionsList'
import FunctionsView from './views/FunctionsView/FunctionsView'
// import {
//   CreateFunctionPopup, EditCustomQueryFunctionPopup,
//   EditRPFunctionPopup, EditSchemaExtensionFunctionPopup,
//   EditSSSFunctionPopup,
// } from './views/FunctionsView/FunctionPopup/FunctionPopup'
// import { FunctionLogs } from './views/FunctionsView/FunctionLogs/FunctionLogs'
// import CliInfoPopup from './views/SchemaView/CliInfoPopup'

// const ViewerQuery = {
//   viewer: (Component, variables) => Relay.QL`
//     query {
//       viewer {
//         ${Component.getFragment('viewer', variables)}
//       }
//     }
//   `,
// }
//
// const NodeQuery = {
//   node: (Component, variables) => Relay.QL`
//     query {
//       node: node(id: $id) {
//         ${Component.getFragment('node', variables)}
//       }
//     }
//   `,
// }

/**
 * Looks in the route and in parent routes for a loadingColor property
 * @param routes
 * @returns {string}
 */
function getLoadingColor(routes) {
  const stack = routes.slice()
  let color = null
  while (stack.length > 0 && color === null) {
    const route = stack.pop()
    if (route.hasOwnProperty('loadingColor')) {
      color = route['loadingColor']
    }
  }
  return color !== null ? color : '#8989B1'
}

/* eslint-disable react/prop-types */
const oldRender = ({error, props, routerProps, element, ...rest}) => {
  if (error) {
    if (error.message && error.message === 'Failed to fetch' && location.pathname === '/') {
      cookiestore.remove('graphcool_auth_token')
      cookiestore.remove('graphcool_customer_id')
      window.location.pathname = '/'
      return null
    }

    const err = error.source.errors[0]

    tracker.track(ConsoleEvents.unexpectedError({error: JSON.stringify(err)}))

    if (err.code === 2001) {
      cookiestore.remove('graphcool_auth_token')
      cookiestore.remove('graphcool_customer_id')
      tracker.reset()

      return (
        <RedirectOnMount to={`/login${routerProps.location.search}`} />
      )
    }

    // if the project doesn't exist on this account
    if (err.code === 4033) {
      graphcoolAlert('The requested project doesn\'t exist on your account.')

      return (
        <RedirectOnMount to={`/`} />
      )
    }

    if (routerProps && routerProps.params.projectName && routerProps.params.modelName) {
      // if we have a model and a project, there might be only a problem with the model, so redirect to project
      return (
        <RedirectOnMount to={`/${routerProps.params.projectName}`} />
      )
    }

    return (
      // TODO https://github.com/relay-tools/react-router-relay/issues/156
      <RedirectOnMount to={`/${routerProps.params.projectName}`} />
    )
  }

  if (props) {
    return React.cloneElement(element, props)
  }

  const color = getLoadingColor(routerProps.routes)

  return (
    <div className='loader'>
      <style jsx>{`
        .loader {
          @p: .top0, .left0, .right0, .bottom0, .fixed, .flex, .justifyCenter, .itemsCenter, .z999;
        }
      `}</style>
      <Loading color={color}/>
    </div>
  )
}

function render({Component, props}) {
  if (!Component || !props) {
    return (
      <div className='loader'>
        <style jsx>{`
        .loader {
          @p: .top0, .left0, .right0, .bottom0, .fixed, .flex, .justifyCenter, .itemsCenter, .z999;
          pointer-events: none;
        }
      `}</style>
        <Loading color={'black'}/>
      </div>
    )
  }

  return <Component {...props} />
}

const ProjectViewerQuery = graphql`
  query routes_ProjectRootView_Query($projectName: String!) {
    viewer {
      ...ProjectRootView_viewer
    }
  }
`

const FunctionsViewerQuery = graphql`
  query routes_FunctionsView_Query($projectName: String!) {
    viewer {
      ...FunctionsView_viewer
    }
  }
`

export default (
  makeRouteConfig(
    <Route path='/' Component={RootView}>
      <Route Component={RootRedirectView} query={graphql`
        query routes_RootRedirectView_Query {
          viewer {
            ...RootRedirectView_viewer
          }
        }
      `} render={render}/>
      {/*
      <Route path='signup' Component={({location}) => <AuthView initialScreen='signUp' location={location} />}/>
      <Route path='login' Component={({location}) => <AuthView initialScreen='login' location={location} />}/>
       <Route path='token' Component={TokenRedirectView}/>
       <Route path='cli/auth' Component={CLIAuthView} onEnter={CLIAuthView.routeRedirectWhenAuthenticated}/>
       <Route path='cli/auth/success' Component={CLIAuthSuccessView} />
       <Route path='cli/auth/success-init' Component={CLIAuthSuccessInitView}/>
       <Route path='reset-password' Component={ResetPasswordView}/>
       <Route path='after-signup' Component={AfterSignUpView} queries={ViewerQuery} render={render}/>
       */}

      <Route path='showroom' Component={ShowRoom}/>
      <Route path=':projectName' Component={ProjectRootView} query={ProjectViewerQuery} render={render}>
        <Route path='functions' Component={FunctionsView} query={FunctionsViewerQuery} render={render}>
        </Route>
      </Route>
      {/*
        <Redirect to='functions'/>

       */}
        {/*
         <Redirect from='settings' to='settings/general'/>
         <Route path='token' Component={TokenRedirectView}/>
         <Route path='settings' Component={Settings} render={render}>
         <Route path='general' Component={General} queries={ViewerQuery} render={render}/>
         <Route path='authentication' Component={Authentication} queries={ViewerQuery} render={render}/>
         <Route path='export' Component={Export} queries={ViewerQuery} render={render}/>
         <Route path='billing' Component={Billing} queries={ViewerQuery} render={render}>
         <Route path='change-plan/:plan' Component={ChangePricingPlan} render={render}/>
         <Route path='confirm-plan/:plan' Component={ConfirmPricingPlan} queries={ViewerQuery} render={render}/>
         </Route>
         <Route path='team' Component={Team} queries={ViewerQuery} render={render}/>
         </Route>
         <Route path='clone' Component={CloneProjectPopup} queries={ViewerQuery} render={render}/>
         // TODO reenable
         */}
          {/*
           <Route path='create' Component={CreateFunctionPopup} queries={ViewerQuery} render={render}>
           <Route
           path='fullscreen'
           Component={null}
           />
           </Route>
           <Route
           path=':id/logs'
           Component={FunctionLogs}
           queries={{node: NodeQuery.node, viewer: ViewerQuery.viewer}}
           render={render}
           />
           <Route
           path=':id/sss/edit'
           Component={EditSSSFunctionPopup}
           queries={{node: NodeQuery.node, viewer: ViewerQuery.viewer}}
           render={render}
           >
           <Route
           path='fullscreen'
           Component={null}
           />
           </Route>
           <Route
           path=':id/rp/edit'
           Component={EditRPFunctionPopup}
           queries={{node: NodeQuery.node, viewer: ViewerQuery.viewer}}
           render={render}
           >
           <Route
           path='fullscreen'
           Component={null}
           />
           </Route>
           <Route
           path=':id/schema_extension/edit'
           Component={EditSchemaExtensionFunctionPopup}
           queries={{node: NodeQuery.node, viewer: ViewerQuery.viewer}}
           render={render}
           >
           <Route
           path='fullscreen'
           Component={null}
           />
           </Route>
           </Route>
           */}
        {/*
         <Route path='account' Component={AccountView} queries={ViewerQuery} render={render}>
         <Route path='settings' Component={SettingsTab} queries={ViewerQuery} render={render}/>
         <IndexRedirect to='settings'/>
         </Route>
         <Route path='schema' Component={NewSchemaView} queries={ViewerQuery} render={render} loadingColor='white'>
         <Route path='cli-guide' Component={CliInfoPopup} render={render}/>
         <Route path='types' Component={null} render={render}/>
         <Route path='interfaces' Component={null} render={render}/>
         <Route path='enums' Component={null} render={render}>
         <Route path='edit/:enumName' Component={null} render={render}/>
         </Route>
         <Route path='relations'>
         <Route path='create' Component={RelationPopup} queries={ViewerQuery} render={render}/>
         <Route path='edit/:relationName' Component={RelationPopup} queries={ViewerQuery} render={render}/>
         </Route>
         <Route path=':modelName'>
         <Route path='edit' Component={null} render={render}/>
         <Route path='edit/:fieldName' Component={FieldPopup} queries={ViewerQuery} render={render}/>
         <Route path='create' Component={FieldPopup} queries={ViewerQuery} render={render}/>
         </Route>
         </Route>
         <Route path='graph-view' Component={SchemaViewer} queries={ViewerQuery} render={render}/>
         <Route path='models'>
         <IndexRoute Component={ModelRedirectView} queries={ViewerQuery} render={render}/>
         <Route path=':modelName/databrowser' Component={DatabrowserView} queries={ViewerQuery} render={render}/>
         <Route path=':modelName' Component={ModelRedirectView} queries={ViewerQuery} render={render}/>
         </Route>
         <Route path='permissions' Component={PermissionsView} queries={ViewerQuery} render={render}>
         <IndexRoute Component={PermissionsList}/>
         <Route path='relations' Component={AllRelationPermissionsList}>
         <Route
         path=':relationName/edit/:id'
         Component={EditRelationPermissionPopup}
         queries={{node: NodeQuery.node, viewer: ViewerQuery.viewer}}
         render={render}
         />
         <Route
         path=':relationName/create'
         Component={AddRelationPermissionPopup}
         queries={ViewerQuery}
         render={render}
         />
         </Route>
         <Route Component={PermissionsList}>
         <Route
         path=':modelName/edit/:id'
         Component={EditPermissionPopup}
         queries={{node: NodeQuery.node, viewer: ViewerQuery.viewer}}
         render={render}
         />
         <Route path=':modelName/create' Component={AddPermissionPopup} queries={ViewerQuery} render={render}/>
         </Route>
         </Route>
         <Route path='actions' Component={ActionsView} queries={ViewerQuery} render={render}/>
         <Route path='playground' Component={PlaygroundView} queries={ViewerQuery} render={render}/>
         <Route path='settings' Component={ProjectSettingsView} queries={ViewerQuery} render={render}/>
         <Route path='algolia' Component={AlgoliaView} queries={ViewerQuery} render={render}/>
         <Route path='integrations' Component={IntegrationsView} queries={ViewerQuery} render={render}>
         <Route path='authentication/:provider' Component={AuthProviderPopup} queries={ViewerQuery} render={render}/>
         </Route>
         </Route>
         */}
    </Route>,
  )
)
