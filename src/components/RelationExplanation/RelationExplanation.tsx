import * as React from 'react'
import * as Relay from 'react-relay'
import {Model, Project} from '../../types/types'
const classes: any = require('./RelationExplanation.scss')

interface Props {
  project: Project
  fieldOnLeftModelName: string
  fieldOnRightModelName: string
  fieldOnLeftModelIsList: boolean
  fieldOnRightModelIsList: boolean
  leftModelId: string
  rightModelId: string
}

class RelationExplanation extends React.Component<Props, {}> {

  render() {
    const {fieldOnLeftModelIsList, leftModelId, fieldOnRightModelIsList, rightModelId} = this.props

    const leftModelMultiplicity = fieldOnLeftModelIsList ? 'Many' : 'One'
    const leftModelName = fieldOnRightModelIsList
      ? this.getModelNamePlural(leftModelId) : this.getModelName(leftModelId)
    const leftNameS = this.getModelName(leftModelId).slice(-1) === 's'
      ? `'` : `'s`

    const rightModelMultiplicity = fieldOnRightModelIsList ? 'Many' : 'One'
    const rightModelName = fieldOnLeftModelIsList
      ? this.getModelNamePlural(rightModelId) : this.getModelName(rightModelId)
    const rightNameS = this.getModelName(rightModelId).slice(-1) === 's' ? `'` : `'s`
    return (
      <div className={classes.root}>
        <div className={classes.sentence}>
          <span className={classes.multiplicity}>{rightModelMultiplicity}</span> <span className={classes.model}>{leftModelName}</span>
          {` ${rightModelMultiplicity === 'One' ? 'is' : 'are'} related to `}
          <span className={classes.multiplicity}>{leftModelMultiplicity.toLowerCase()}</span> <span className={classes.model}>{rightModelName}</span>
        </div>
        {this.props.fieldOnLeftModelName &&
        <div className={classes.sentence}>
          <span className={classes.model}>{this.getModelName(leftModelId)}</span>{`${leftNameS} field `}
          <span className={classes.field}>{this.props.fieldOnLeftModelName}</span>
          {` represents `}
          <span className={classes.multiplicity}>{leftModelMultiplicity.toLowerCase()}</span> <span className={classes.model}>{rightModelName}</span>
        </div>
        }
        {this.props.fieldOnRightModelName &&
        <div className={classes.sentence}>
          <span className={classes.model}>{this.getModelName(rightModelId)}</span>{`${rightNameS} field `}
          <span className={classes.field}>{this.props.fieldOnRightModelName}</span>
          {` represents `}
          <span className={classes.multiplicity}>{rightModelMultiplicity.toLowerCase()}</span> <span className={classes.model}>{leftModelName}</span>
        </div>
        }
      </div>
    )
  }

  private getModelName = (id: string): string => {
    return this.getModel(id).name
  }

  private getModelNamePlural = (id: string): string => {
    return this.getModel(id).namePlural
  }

  private getModel = (id: string): Model => {
    return this.props.project.models.edges.map((edge) => edge.node).find((node) => node.id === id)
  }
}

export default Relay.createContainer(RelationExplanation, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
          models (first: 1000) {
            edges {
              node {
                id
                name
                namePlural
              }
            }
        }
      }
    `,
  },
})
