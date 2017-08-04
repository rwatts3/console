import * as React from 'react'
import { Field, Model } from '../../../../../types/types'

interface Props {
  onSetNull: () => void
  onSave: () => void
  onCancel: () => void
  field: Field
  changed: boolean
  values: string[] | null
  model: Model
  nodeId: string
}

const SelectNodesCellFooter = ({
  onSetNull,
  onSave,
  onCancel,
  field,
  changed,
  values,
  model,
  nodeId,
}: Props) =>
  <div className="select-nodes-cell-footer">
    <style jsx>{`
      .select-nodes-cell-footer {
        @p: .bgBlack04, .pa25, .flex, .justifyBetween, .itemsCenter;
      }
      .flexy {
        @p: .flex, .itemsCenter;
      }
      .button {
        @p: .pv10, .ph25, .br2, .f16, .pointer;
      }
      .save {
        @p: .bgGreen, .white, .ml16;
      }
      .save:hover {
        @p: .bgGreen80;
      }
      .cancel {
        @p: .black50;
      }
      .cancel:hover {
        @p: .black70;
      }
      .null {
        @p: .red;
      }
      .info {
        @p: .ml25, .f14, .black40;
      }
      .id {
        @p: .bgBlack04, .br2, .black50, .ml12, .f12, .inlineFlex, .itemsCenter,
          .fw4;
        font-family: 'Source Code Pro', 'Consolas', 'Inconsolata',
          'Droid Sans Mono', 'Monaco', monospace;
        padding: 3px 6px 4px 6px;
      }
      .model {
        @p: .fw6, .black60, .mh4;
      }
    `}</style>
    <div className="flex itemsCenter">
      {values &&
        values.length > 0 &&
        <div className="button cancel" onClick={onSetNull}>
          Unselect {field.isList ? ' all' : ' node'}
        </div>}
      <div className="info">
        Select a node to connect nodes to the
        <span className="model">{model.name}</span> node with id
        <span className="id">{nodeId}</span>
      </div>
    </div>
    <div className="flexy">
      <div className="button cancel" onClick={onCancel}>
        {changed ? 'Cancel' : 'Close'}
      </div>
      {changed &&
        <div className="button save" onClick={onSave}>
          Save
        </div>}
    </div>
  </div>

export default SelectNodesCellFooter
