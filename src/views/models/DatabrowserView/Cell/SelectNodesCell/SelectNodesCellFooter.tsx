import * as React from 'react'

interface Props {
  onSetNull: () => void
  onSave: () => void
  onCancel: () => void
}

const SelectNodesCellFooter = ({onSetNull, onSave, onCancel}: Props) => (
  <div className='select-nodes-cell-footer'>
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
    `}</style>
    <div className='button null' onClick={onSetNull}>Set null</div>
    <div className='flexy'>
      <div className='button cancel' onClick={onCancel}>Cancel</div>
      <div className='button save' onClick={onSave}>Save</div>
    </div>
  </div>
)

export default SelectNodesCellFooter