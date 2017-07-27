import {ChromelessOptions} from 'chromeless'
// export const CONSOLE_URL = process.env.INTEGRATION_URL || 'https://dev.console.graph.cool'
export const CONSOLE_URL = process.env.INTEGRATION_URL || 'https://staging-dev.console.graph.cool'

export const config: ChromelessOptions = {
  debug: true,
  remote: undefined,
  waitTimeout: 10000,
  viewport: {
    scale: 0.5,
    width: 1920,
    height: 1080,
  },
}
