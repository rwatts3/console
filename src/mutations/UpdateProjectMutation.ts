import * as Relay from 'react-relay'

interface Project {
  id: string
}

interface Props {
<<<<<<< HEAD:src/mutations/UpdateProjectMutation.ts
=======
  webhookUrl: string,
>>>>>>> 9de11d534d9a0c5e5881930e0a223b5ca32749a8:src/mutations/UpdateProjectMutation.ts
  name: string,
  project: Project
}

export default class UpdateProjectMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{updateProject}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateProjectPayload {
        project {
          id
          name
        }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        project: this.props.project.id,
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.project.id,
      name: this.props.name,
    }
  }

  getOptimisticResponse () {
    return {
      project: {
        id: this.props.project.id,
        name: this.props.name,
      },
    }
  }

}
