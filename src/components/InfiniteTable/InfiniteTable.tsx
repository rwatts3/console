import * as React from 'react'
import {InfiniteLoader, Grid} from 'react-virtualized'

interface Props {
  minimumBatchSize?: number
  threshold?: number
  width: number
  height: number
  columnCount: number
  columnWidth: (input: any) => number
  loadMoreRows: (input: any) => Promise<any>
  addNew: boolean

  rowCount: number
  rowHeight: number
  cellRenderer: (input: any) => JSX.Element | string
  loadingCellRenderer: (input: any) => JSX.Element | string

  headerHeight: number
  headerRenderer: (input: any) => JSX.Element | string

  addRowHeight: number
  addCellRenderer: (input: any) => JSX.Element | string
}

interface State {
}

export default class InifiniteTable extends React.Component<Props, State> {

  loaded = []

  constructor(props: Props) {
    super(props)
    for (let i = 0; i < this.props.rowCount; i++) {
      this.loaded.push(false)
    }
  }

  render() {
    return (
      <div style={{height: '100%', position: 'relative'}}>
        <InfiniteLoader
          minimumBatchSize={this.props.minimumBatchSize}
          threshold={this.props.threshold}
          rowCount={this.props.rowCount}
          loadMoreRows={this.loadMoreRows}
          isRowLoaded={({index}) => this.loaded[index]}
          >
          {({onRowsRendered, registerChild}) => (
            <div style={{display: 'flex', flexDirection: 'row', height: '100%', position: 'relative'}}>
              <Grid
                columnWidth={this.props.columnWidth}
                columnCount={this.props.columnCount}
                height={this.props.headerHeight}
                cellRenderer={this.props.headerRenderer}
                cellStyle={{position: 'absolute', marginTop: '-1px'}}
                rowHeight={this.props.headerHeight}
                rowCount={1}
                style={{overflow: 'visible', width: 'auto', position: 'relative'}}
                width={this.props.width}
              />
              {this.props.addNew &&
              <Grid
                ref={registerChild}
                width={this.props.width}
                height={this.props.addRowHeight}
                style={{overflow: 'scroll', position: 'absolute', width: 'auto', top: this.props.headerHeight}}
                cellStyle={{position: 'absolute'}}
                rowHeight={this.props.addRowHeight}
                columnCount={1}
                columnWidth={this.props.width}
                rowCount={1}
                cellRenderer={this.props.addCellRenderer}
              />
              }
              <Grid
                ref={registerChild}
                width={this.props.width}
                height={this.props.height - this.props.headerHeight - (this.props.addNew ? this.props.addRowHeight : 0)}
                style={{
                  overflow: 'scroll',
                  position: 'absolute',
                  width: 'auto',
                  top: this.props.headerHeight + (this.props.addNew ? this.props.addRowHeight : 0),
                }}
                cellStyle={{position: 'absolute'}}
                rowHeight={this.props.rowHeight}
                columnCount={this.props.columnCount}
                columnWidth={this.props.columnWidth}
                rowCount={this.props.rowCount}
                cellRenderer={this.renderCell}
                onSectionRendered={(section) => this.onGridRowsRendered(section, onRowsRendered)}
              />
            </div>
          )}
        </InfiniteLoader>
      </div>
    )
  }

  private renderCell = (input) => {
    if (this.loaded[input.rowIndex]) {
      return this.props.cellRenderer(input)
    } else {
      return this.props.loadingCellRenderer(input)
    }
  }

  private loadMoreRows = (input) => {
    return new Promise((resolve, reject) => {
      this.props.loadMoreRows(input).then(() => {
        for (let i = input.startIndex; i <= input.stopIndex; i++) {
          this.loaded[i] = true
        }
        resolve(true)
      })
    })
  }

  private onGridRowsRendered = (section, onRowsRendered) => {
    onRowsRendered({
      startIndex: section.rowStartIndex,
      stopIndex: section.rowStopIndex,
      overscanStartIndex: section.rowOverscanStartIndex,
      overscanStopIndex: section.rowOverscanStopIndex,
    })
  }
}
