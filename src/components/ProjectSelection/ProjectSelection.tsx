import * as React from 'react'
import { Link } from 'react-router'
import * as PureRenderMixin from 'react-addons-pure-render-mixin'
import ScrollBox from '../../components/ScrollBox/ScrollBox'
import Icon from '../../components/Icon/Icon'
import { Project } from '../../types/types'
const classes: any = require('./ProjectSelection.scss')

interface Props {
  params: any
  add: () => void
  selectedProject: Project
  projects: Project[]
}

interface State {
  expanded: boolean
}

export default class ProjectSelection extends React.Component<Props, State> {

  state = {
    expanded: false,
  }

  shouldComponentUpdate: any

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  _toggle = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  _onSelectProject = () => {
    this._toggle()

    analytics.track('sidenav: selected project')
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.head} onClick={this._toggle}>
          <div className={classes.logo}>
            <Icon
              width={30}
              height={35}
              src={require('assets/icons/logo.svg')}
              color='#fff'
              />
          </div>
          <span className={classes.title}>
            {this.props.selectedProject.name}
          </span>
          <div className={`${classes.arrow} ${this.state.expanded ? classes.up : ''}`}>
            <Icon
              width={11}
              height={6}
              src={require('assets/icons/arrow.svg')}
              color='#fff'
              />
          </div>
        </div>
        {this.state.expanded &&
          <div className={classes.overlay}>
            <ScrollBox>
              <div className={classes.listHead}>All Projects</div>
              {this.props.projects.map((project) => (
                <Link
                  key={project.name}
                  className={classes.listElement}
                  onClick={this._onSelectProject}
                  to={`/${project.name}`}
                  activeClassName={classes.listElementActive}
                  >
                  {project.name}
                  <div title='Duplicate' className={classes.listElementDuplicate}>
                    <Icon
                      src={require('assets/icons/model.svg')}
                      color='#fff'
                      />
                  </div>
                </Link>
              ))}
              <div className={classes.add} onClick={this.props.add}>+ New Project</div>
            </ScrollBox>
          </div>
        }
      </div>
    )
  }
}
