import * as React from 'react'
import * as Relay from 'react-relay'
import {Model, Project} from '../../types/types'

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

    const leftModelMultiplicity = fieldOnLeftModelIsList ? 'One' : 'Many'
    const leftModelName = fieldOnLeftModelIsList ? this.getModelNamePlural(leftModelId) : this.getModelName(leftModelId)
    const leftNameS = this.getModelName(leftModelId).slice(-1) === 's' ? `'` : `'s`

    const rightModelMultiplicity = fieldOnRightModelIsList ? 'One' : 'Many'
    const rightModelName = fieldOnRightModelIsList ? this.getModelNamePlural(rightModelId) : this.getModelName(rightModelId)
    const rightNameS = this.getModelName(rightModelId).slice(-1) === 's' ? `'` : `'s`
    return (
      <div>
        <div>
          <span>{leftModelMultiplicity}</span> <span>{leftModelName}</span>
          {` are related to `}
          <span>{rightModelMultiplicity.toLowerCase()}</span> <span>{rightModelName}</span>
        </div>
        <div>
          <span>{this.getModelName(leftModelId)}</span>{`${leftNameS} field `}<span>{this.props.fieldOnLeftModelName}</span>
          {` represents `}
          <span>{rightModelMultiplicity.toLowerCase()}</span> <span>{rightModelName}</span>
        </div>
        <div>
          <span>{this.getModelName(rightModelId)}</span>{`${rightNameS} field `}<span>{this.props.fieldOnRightModelName}</span>
          {` represents `}
          <span>{leftModelMultiplicity.toLowerCase()}</span> <span>{leftModelName}</span>
        </div>
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
    `
  }
})
