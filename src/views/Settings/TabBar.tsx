import * as React from 'react'
import {Link} from 'react-router'

interface Props {
  params: any
}

export default ({params}: Props) => {

  return (
    <div className='tabBarContainer'>
      <style jsx={true} global>{`

        .tabBarContainer {
          @inherit: .flex;

          .linkStyle {
            @inherit: .ttu, .fw6, .black20, .ph25, .pv16, .bb, .bBlack10;
          }

          .activeLinkStyle {
            @inherit: .ttu, .fw6, .black50, .ph25, .pv16, .bgWhite, .bt, .bl, .br, .br2, .bw2, .bBlack10;
          }

        }

      `}</style>
      <Link className={location.pathname.endsWith('settings') ? 'activeLinkStyle' : 'linkStyle'} to={`/${params.projectName}/settings`}>General</Link>
      <Link className='linkStyle' activeClassName='activeLinkStyle' to={`/${params.projectName}/settings/authentication`}>Authentication</Link>
      <Link className='linkStyle' activeClassName='activeLinkStyle'>Export</Link>
      <Link className='linkStyle' activeClassName='activeLinkStyle'>Team</Link>
      <Link className='linkStyle' activeClassName='activeLinkStyle'>Billing</Link>
    </div>
  )

}
