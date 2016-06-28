import Relay from 'react-relay'

export default class UpdateFieldMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation{updateField}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateFieldPayload {
        field
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        field: this.props.fieldId,
      },
    }]
  }

  getVariables () {
    return {
      id: this.props.fieldId,
      name: this.props.name,
      typeIdentifier: this.props.typeIdentifier,
      enumValues: this.props.enumValues,
      isRequired: this.props.isRequired,
      isList: this.props.isList,
      isUnique: false,
      defaultValue: this.props.defaultValue,
      relationId: this.props.relationId,
    }
  }

  getOptimisticResponse () {
    return {
      field: {
        id: this.props.fieldId,
        name: this.props.name,
        typeIdentifier: this.props.typeIdentifier,
        enumValues: this.props.enumValues,
        isRequired: this.props.isRequired,
        isList: this.props.isList,
        isUnique: false,
        defaultValue: this.props.defaultValue,
      },
    }
  }
}
