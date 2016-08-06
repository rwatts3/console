import {Field} from '../../../../types/types'
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
import {isScalar} from '../../../../utils/graphql'

export interface InteractionPack {
  value: any
  field: Field
  projectId: string
  itemId: string
  methods: {
    save: (val: any) => void
    cancel: (reload?: boolean) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement | HTMLInputElement>) => void
    onEscapeTextarea: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  }
}

export function getEditCell(pack: InteractionPack): JSX.Element {
  if (!isScalar(pack.field.typeIdentifier)) {
    if (pack.field.isList) {
      return getNonScalarListEditCell(pack)
    } else {
      return getNonScalarEditCell(pack)
    }
  }

  if (pack.field.isList) {
    return getScalarListEditCell(pack)
  }

  return getScalarEditCell(pack)
}

function getNonScalarListEditCell(pack: InteractionPack): JSX.Element {
  return (
    <RelationsPopup
      originField={pack.field}
      originItemId={pack.itemId}
      onCancel={() => pack.methods.cancel(true)}
      projectId={pack.projectId}
    />
  )
}

function getNonScalarEditCell(pack: InteractionPack): JSX.Element {
  return (
    <ModelSelector
      relatedModel={pack.field.relatedModel}
      projectId={pack.projectId}
      value={pack.value ? pack.value.id : null}
      onSelect={pack.methods.save}
      onCancel={pack.methods.cancel}
    />
  )
}

function getScalarListEditCell(pack: InteractionPack): JSX.Element {
  return (
    <textarea
      autoFocus
      type='text'
      ref='input'
      defaultValue={pack.value}
      onKeyDown={(e) => pack.methods.onEscapeTextarea(e)}
      onBlur={(e) => pack.methods.save(e.target.value)}
    />
  )
}

function getScalarEditCell(pack: InteractionPack): JSX.Element {
  switch (pack.field.typeIdentifier) {
    case 'Int':
      return (
        <IntCell
          value={pack.value}
          save={pack.methods.save}
          onKeyDown={pack.methods.onKeyDown}
          field={pack.field}
        />
      )
    case 'Float':
      return (
        <FloatCell
          value={pack.value}
          save={pack.methods.save}
          onKeyDown={pack.methods.onKeyDown}
          field={pack.field}
        />
      )
    case 'Boolean':
      return (
        <BooleanCell
          value={pack.value}
          save={pack.methods.save}
          field={pack.field}
        />
      )
    case 'Enum':
      return (
        <EnumCell
          value={pack.value}
          save={pack.methods.save}
          onKeyDown={pack.methods.onKeyDown}
          field={pack.field}
        />
      )
    case 'String':
      return (
        <StringCell
          value={pack.value}
          onKeyDown={pack.methods.onEscapeTextarea}
          save={pack.methods.save}
          field={pack.field}
        />
      )
    case 'DateTime':
      return (
        <DateTimeCell
          cancel={pack.methods.cancel}
          save={pack.methods.save}
          value={pack.value}
          field={pack.field}
        />
      )
    default:
      return (
        <DefaultCell
          value={pack.value}
          onKeyDown={pack.methods.onKeyDown}
          save={pack.methods.save}
          field={pack.field}
        />
      )
  }
}
