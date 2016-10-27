import * as Relay from 'react-relay'

interface Props {
  fieldId: string
  name: string
  typeIdentifier: string
  enumValues: string[]
  isRequired: boolean
  isList: boolean
  defaultValue?: string
  relationId?: string
  migrationValue?: string
}

export default class UpdateFieldMutation extends Relay.Mutation<Props, {}> {

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
      defaultValue: this.props.defaultValue,
      relationId: this.props.relationId,
      migrationValue: this.props.migrationValue,
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
        defaultValue: this.props.defaultValue,
      },
    }
  }
}
