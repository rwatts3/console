import {ChromelessOptions} from 'chromeless'
// export const CONSOLE_URL = process.env.INTEGRATION_URL || 'https://dev.console.graph.cool'
export const CONSOLE_URL = process.env.INTEGRATION_URL || 'https://console.graph.cool'
// export const CONSOLE_URL = process.env.INTEGRATION_URL || 'https://staging-dev.console.graph.cool'

export const config: ChromelessOptions = {
  debug: true,
  remote: true,
  implicitWait: true,
  waitTimeout: 10000,
  viewport: {
    scale: 0.75,
    width: 1400,
    height: 1050,
  },
}
