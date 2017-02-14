
import * as Relay from 'react-relay'

interface Props {
  projectId: string
  token: string
}

export default class SetCreditCardMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{setCreditCard}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on SetCreditCardPayload {
        viewer {
          user {
            crm {
              customer {
                projects(first: 1000) {
                  edges {
                    node {
                      projectBillingInformation {
                        creditCard {
                          expMonth
                          expYear
                          last4
                          name
                          addressLine1
                          addressLine2
                          addressCity
                          addressZip
                          addressState
                          addressCountry
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  }

  getConfigs () {
    return []
  //   return [{
  //     type: 'FIELDS_CHANGE',
  //     fieldIDs: {
  //       project: this.props.projectId,
  //     },
  //   }]
  }

  getVariables () {
    return {
      projectId: this.props.projectId,
      token: this.props.token,
    }
  }
}
