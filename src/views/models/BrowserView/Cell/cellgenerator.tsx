import { Field } from '../../../../types/types'
import * as React from 'react'
import IntCell from './IntCell'
import FloatCell from './FloatCell'
import BooleanCell from './BooleanCell'
import EnumCell from './EnumCell'
import StringCell from './StringCell'
import DateTimeCell from './DateTimeCell'
import DefaultCell from './DefaultCell'
import ModelSelector from '../../../../components/ModelSelector/ModelSelector'
import RelationsPopup from '../RelationsPopup'
import { isScalar } from '../../../../utils/graphql'
import ScalarListCell from './ScalarListCell'

export interface CellRequirements {
  value: any
  field: Field
  projectId: string
  itemId: string
  methods: {
    save: (val: any, what?: any) => void
    cancel: (reload?: boolean) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement | HTMLInputElement>, what?: boolean) => void
    onEscapeTextarea: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  }
}

export function getEditCell(reqs: CellRequirements): JSX.Element {
  if (!isScalar(reqs.field.typeIdentifier)) {
    if (reqs.field.isList) {
      return getNonScalarListEditCell(reqs)
    } else {
      return getNonScalarEditCell(reqs)
    }
  }

  if (reqs.field.isList) {
    return getScalarListEditCell(reqs)
  }

  return getScalarEditCell(reqs)
}

function getNonScalarListEditCell(reqs: CellRequirements): JSX.Element {
  return (
    <RelationsPopup
      originField={reqs.field}
      originItemId={reqs.itemId}
      onCancel={() => reqs.methods.cancel(true)}
      projectId={reqs.projectId}
    />
  )
}

function getNonScalarEditCell(reqs: CellRequirements): JSX.Element {
  return (
    <ModelSelector
      relatedModel={reqs.field.relatedModel}
      projectId={reqs.projectId}
      value={reqs.value ? reqs.value.id : null}
      onSelect={reqs.methods.save}
      onCancel={reqs.methods.cancel}
    />
  )
}

function getScalarListEditCell(reqs: CellRequirements): JSX.Element {
  return (

    <ScalarListCell
      value={reqs.value}
      save={reqs.methods.save}
      onKeyDown={reqs.methods.onEscapeTextarea}
      field={reqs.field}
    />
  )
}

function getScalarEditCell(reqs: CellRequirements): JSX.Element {
  switch (reqs.field.typeIdentifier) {
    case 'Int':
      return (
        <IntCell
          value={reqs.value}
          save={reqs.methods.save}
          onKeyDown={reqs.methods.onKeyDown}
          field={reqs.field}
        />
      )
    case 'Float':
      return (
        <FloatCell
          value={reqs.value}
          save={reqs.methods.save}
          onKeyDown={reqs.methods.onKeyDown}
          field={reqs.field}
        />
      )
    case 'Boolean':
      return (
        <BooleanCell
          value={reqs.value}
          save={reqs.methods.save}
          field={reqs.field}
        />
      )
    case 'Enum':
      return (
        <EnumCell
          value={reqs.value}
          save={reqs.methods.save}
          onKeyDown={reqs.methods.onKeyDown}
          field={reqs.field}
        />
      )
    case 'String':
      return (
        <StringCell
          value={reqs.value}
          onKeyDown={reqs.methods.onEscapeTextarea}
          save={reqs.methods.save}
          field={reqs.field}
        />
      )
    case 'DateTime':
      return (
        <DateTimeCell
          cancel={reqs.methods.cancel}
          save={reqs.methods.save}
          value={reqs.value}
          field={reqs.field}
        />
      )
    default:
      return (
        <DefaultCell
          value={reqs.value}
          onKeyDown={reqs.methods.onKeyDown}
          save={reqs.methods.save}
          field={reqs.field}
        />
      )
  }
}
