import * as React from 'react'
const classes: any = require('./LoadingCell.scss')

interface Props {
  backgroundColor: string
  empty?: boolean
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
          {!this.props.empty &&
          <div
            className={classes.loader}
            style={{width: `${100 - (50 * Math.random())}%`}}
          />
          }
        </span>
      </div>
    )
  }
}
