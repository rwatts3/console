import * as React from 'react'
import {AutoSizer, InfiniteLoader, FlexColumn, FlexTable, Grid, ScrollSync} from 'react-virtualized'
const classes: any = require('./InfiniteTable.scss')

interface Props {
  rowCount: number
  rowHeight: number
  headerHeight: number
  columnCount: number
  cellRenderer: (any) => JSX.Element | string
  loadingCellRenderer: (any) => JSX.Element | string
  minimumBatchSize?: number
  threshold?: number
  headerRenderer: (any) => JSX.Element | string
  columnWidth: (any) => number
  loadMoreRows: (any) => Promise<any>
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
      <div style={{height: '100%'}}>
        <InfiniteLoader
          minimumBatchSize={this.props.minimumBatchSize}
          threshold={this.props.threshold}
          rowCount={this.props.rowCount}
          loadMoreRows={this.loadMoreRows}
          isRowLoaded={({index}) => this.loaded[index]}
          >
          {({onRowsRendered, registerChild}) => (
          <ScrollSync>
            { ({scrollLeft, onScroll}) =>
            <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
              <AutoSizer>
                {({width, height}) => (
                <div>
                  <Grid
                    className={classes.headerContainer}
                    columnWidth={this.props.columnWidth}
                    columnCount={this.props.columnCount}
                    scrollLeft={scrollLeft}
                    height={this.props.headerHeight}
                    cellRenderer={this.props.headerRenderer}
                    rowHeight={this.props.headerHeight}
                    rowCount={1}
                    width={width}
                  />
                  <Grid
                    ref={registerChild}
                    width={width}
                    height={height}
                    rowHeight={this.props.rowHeight}
                    columnCount={this.props.columnCount}
                    onScroll={onScroll}
                    columnWidth={this.props.columnWidth}
                    rowCount={this.props.rowCount}
                    cellRenderer={this.renderCell}
                    onSectionRendered={(section) => this.onGridRowsRendered(section, onRowsRendered)}
                    >
                  </Grid>
                </div>
                )}
              </AutoSizer>
            </div>
            }
          </ScrollSync>
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
