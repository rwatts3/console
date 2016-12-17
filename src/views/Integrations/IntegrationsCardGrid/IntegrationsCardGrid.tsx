import * as React from 'react'
import IntegrationsCard from '../IntegrationsCard/IntegrationsCard';

const mockIntegration = {
  connected: false,
  logoURI: 'http://www.revalueyourit.com/assets/Algolia_logo_bg-white-0896a46b68512d010ae60f80a8634fac627eb45b7d0f6028e5af5fcf74549f9c.svg',
  description: 'Hosted Search API that delivers instant and relevant results from the first keystroke'
}

const IntegrationsCardGrid = (props) => {
  return (
    <div>
      <IntegrationsCard integration={mockIntegration} />
    </div>
  )
}

export default IntegrationsCardGrid
