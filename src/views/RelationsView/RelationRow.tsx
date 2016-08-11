import * as React from 'react'
import * as Relay from 'react-relay'
import {Relation, Project} from '../../types/types'
import Icon from '../../components/Icon/Icon'
import RelationModels from './RelationModels'
import DeleteRelationMutation from '../../mutations/DeleteRelationMutation'
const classes: any = require('./RelationRow.scss')

interface Props {
  relation: Relation
  project: Project
  onClick: () => void
}

class RelationRow extends React.Component<Props,{}> {

  render(): JSX.Element {
    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <div>
            <div>
              <span className={classes.name}>
                {this.props.relation.name}
              </span>
              <span>
              <RelationModels
                projectName={this.props.project.name}
                leftModel={this.props.relation.leftModel}
                rightModel={this.props.relation.rightModel}
              />
              </span>
            </div>
            {this.props.relation.description &&
            <div className={classes.description}>
              {this.props.relation.description}
            </div>
            }
          </div>
          <div>
            <span className={classes.delete} onClick={this.delete}>
              <Icon
                width={20}
                height={20}
                src={require('assets/icons/delete.svg')}
              />
            </span>
          </div>
        </div>
      </div>
    )
  }

  private delete = (e: React.MouseEvent<any>): void => {
    e.stopPropagation()

    if (window.confirm('Do you really want to delete this Relation?')) {
      Relay.Store.commitUpdate(
        new DeleteRelationMutation({
          relationId: this.props.relation.id,
          projectId: this.props.project.id,
        })
      )
    }
  }
}

export default Relay.createContainer(RelationRow, {
    fragments: {
        relation: () => Relay.QL`
            fragment on Relation {
                id
                name
                description
                leftModel {
                    id
                    name
                }
                rightModel {
                    id
                    name
                }
                fieldOnLeftModel {
                    id
                    name
                }
                fieldOnRightModel {
                    id
                    name
                }
            }
        `,
    },
})
