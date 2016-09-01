import * as React from 'react'
const classes: any = require('./LoadingCell.scss')

interface Props {
  backgroundColor: string
}

export default class LoadingCell extends React.Component<Props, {}> {
  render() {
    return (
      <div
        style={{
          backgroundColor: this.props.backgroundColor,
        }}
        className={classes.root}
      >
        <span className={classes.content}>
          <div
            className={classes.loader}
            style={{width: `${100 - (50 * Math.random())}%`}}
          >
          </div>
        </span>
      </div>
    )
  }
}
