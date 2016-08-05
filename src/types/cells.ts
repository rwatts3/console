export interface CellProps {
  valueString: string,
  save?: (value: string) => void,
  cancel?: () => void,
  onKeyDown?: (event: any) => void,
  field?: any,
}
