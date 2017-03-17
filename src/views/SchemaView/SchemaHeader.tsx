import * as React from 'react'
import {$v,Icon} from 'graphcool-styles'
import Info from '../../components/Info'
import {Link} from 'react-router'

interface Props {
  projectName: string
}

export default class SchemaHeader extends React.Component<Props,null> {
  render() {
    return (
      <div className='schema-header'>
        <style jsx={true}>{`
          .schema-header {
            @p: .flex, .justifyEnd, .flexFixed;
            height: 58px;
            padding-right: 12px;
            background-color: #08131B;
          }
          .button {
            @p: .br2, .darkBlue, .f14, .fw6, .inlineFlex, .ttu, .itemsCenter, .pointer;
            letter-spacing: 0.53px;
            background-color: rgb(185,191,196);
            padding: 7px 10px 8px 10px;
            .text {
              @p: .ml10;
            }
          }
          .button :global(i) {
            @p: .o70;
          }
          .info {
            @p: .mr16;
          }
          .right {
            @p: .flex, .itemsCenter;
            margin-bottom: 12px;
          }
          a {
            @p: .underline;
          }
        `}</style>
        <div className='right'>
          <div className='info'>
            <Info bright slim>
              {'To learn more about your Graphcool Data Schema, just have a look '}
              <a
                target='_blank'
                href='https://www.graph.cool/docs/reference/platform/data-schema-ahwoh2fohj'
              >
                {'in our Docs'}
              </a>
            </Info>
          </div>
          <Link to={`/${this.props.projectName}/voyager`}>
            <div className='button'>
              <Icon
                width={15}
                height={15}
                src={require('assets/icons/graphView.svg')}
                color={$v.darkBlue}
              />
              <div className='text'>Graph View</div>
            </div>
          </Link>
        </div>
      </div>
    )
  }
}
