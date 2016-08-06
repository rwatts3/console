import {Field} from '../types/types'
import * as React from 'react'
import IntCell from '../views/models/BrowserView/Cell/IntCell'
import FloatCell from '../views/models/BrowserView/Cell/FloatCell'
import BooleanCell from '../views/models/BrowserView/Cell/BooleanCell'
import EnumCell from '../views/models/BrowserView/Cell/EnumCell'
import StringCell from '../views/models/BrowserView/Cell/StringCell'
import DateTimeCell from '../views/models/BrowserView/Cell/DateTimeCell'
import DefaultCell from '../views/models/BrowserView/Cell/DefaultCell'
import ModelSelector from '../components/ModelSelector/ModelSelector'
import RelationsPopup from '../views/models/BrowserView/RelationsPopup'
import {isScalar} from './graphql'

export interface InteractionPack {
  value: any
  field: Field
  projectId: string
  itemId: string
  methods: {
    save: (val: string) => void
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
        />
      )
    case 'Float':
      return (
        <FloatCell
          value={pack.value}
          save={pack.methods.save}
          onKeyDown={pack.methods.onKeyDown}
        />
      )
    case 'Boolean':
      return (
        <BooleanCell
          value={pack.value}
          save={pack.methods.save}
        />
      )
    case 'Enum':
      return (
        <EnumCell
          field={this.props.field}
          value={pack.value}
          save={pack.methods.save}
          onKeyDown={pack.methods.onKeyDown}
        />
      )
    case 'String':
      return (
        <StringCell
          value={pack.value}
          onKeyDown={pack.methods.onEscapeTextarea}
          save={pack.methods.save}
        />
      )
    case 'DateTime':
      return (
        <DateTimeCell
          cancel={pack.methods.cancel}
          save={pack.methods.save}
          value={pack.value}
        />
      )
    default:
      return (
        <DefaultCell
          value={pack.value}
          onKeyDown={pack.methods.onKeyDown}
          save={pack.methods.save}
        />
      )
  }
}
