import {Field} from '../../../../types/types'

export interface CellProps<T> {
  value: T,
  save?: (value: T) => void,
  cancel?: () => void,
  onKeyDown?: (event: any) => void,
  field?: Field,
}

export interface CellState {
  valueString: string,
  valid?: boolean,
}
