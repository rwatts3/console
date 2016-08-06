export interface CellProps<T> {
  value: T,
  save?: (value: string) => void,
  cancel?: () => void,
  onKeyDown?: (event: any) => void,
  field?: any,
}
