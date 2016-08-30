import * as React from 'react'
import {AutoSizer, InfiniteLoader, FlexColumn, FlexTable, Grid, ScrollSync} from 'react-virtualized'
const classes: any = require('./InfiniteTable.scss')

interface Props {
  model: any
}

interface State {
  scrollTop: number
  scrollLeft: number
}

export default class InifiniteTable extends React.Component<Props, State> {
  list = [
      { name: 'Brian Vaughn', description: 'Software engineer', loaded: false },
      { name: 'John Doe', description: 'PM', loaded: false },
  ];

  constructor() {
    super()
    for (let i = 0; i < 100; i++) {
      this.list.push({ name: 'John Doe', description: 'PM', loaded: false })
    }
    this.state = {
      scrollTop: 0,
      scrollLeft: 0,
    }
  }

  loadMoreRows = ({startIndex, stopIndex}) => {
    console.log(`loading more rows ${startIndex} - ${stopIndex}`)
    return new Promise(
      (resolve) =>
          setTimeout(() => {
            for (let i = startIndex; i < stopIndex; i++) {
              this.list[i].loaded = true
            }
            resolve(this.list.slice(startIndex, stopIndex))
          }, 1000)
    )
  }

  renderCell = ({rowIndex, columnIndex}) => {
    let value;
    if (this.list[rowIndex].loaded) {
      value = columnIndex === 0 ? this.list[rowIndex].name : this.list[rowIndex].description
    } else {
      value = 'loading'
    }
    return (
      <div style={{display: 'flex', alignItems: 'center', height: 30}}>
        {value}
      </div>
    )
  }

  onGridRowsRendered = (section, onRowsRendered) => {
    onRowsRendered({
      startIndex: section.rowStartIndex,
      stopIndex: section.rowStopIndex,
      overscanStartIndex: section.rowOverscanStartIndex,
      overscanStopIndex: section.rowOverscanStopIndex,
    })
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <InfiniteLoader
          rowCount={this.list.length}
          isRowLoaded={({index}) => this.list[index].loaded}
          loadMoreRows={this.loadMoreRows}
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
                    columnWidth={({index}) => index === 0 ? width * 0.8 : width * 0.5}
                    columnCount={2}
                    scrollLeft={scrollLeft}
                    height={30}
                    cellRenderer={({columnIndex}) => columnIndex === 0 ? 'Name' : 'Description'}
                    rowHeight={30}
                    rowCount={1}
                    width={width}
                  />
                  <Grid
                    ref={registerChild}
                    width={width}
                    height={height}
                    onSectionRendered={(section) => this.onGridRowsRendered(section, onRowsRendered)}
                    headerHeight={30}
                    rowHeight={30}
                    columnCount={2}
                    onScroll={onScroll}
                    columnWidth={({index}) => index === 0 ? width * 0.8 : width * 0.5}
                    rowCount={this.list.length}
                    cellRenderer={this.renderCell}
                    rowGetter={({index}) => this.list[index].loaded ? this.list[index] : ({name: 'loading', description: 'loading'})}
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
}
