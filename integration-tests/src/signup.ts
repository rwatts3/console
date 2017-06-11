import Chromeless from 'chromeless'
const cuid = require('cuid')
import {CONSOLE_URL, runRemote, waitTimeout} from './config'

export default (): Promise<any> =>  {
  const chromeless = new Chromeless({
    runRemote,
    waitTimeout,
  })

  return chromeless
    .goto(CONSOLE_URL + '/signup')
    .wait(1000)
    .wait('button[type="submit"]')
    .type(`test-${cuid()}@graph.cool`, 'input[type="email"]')
    .type(`asdfasdf`, 'input[type="password"]')
    .type(`Bob`, 'input[type="text"]')
    .click('button[type="submit"]')
    .wait(3000)
    // done with signup
    .wait('input[data-test="source"]')
    .type('I am a Test', 'input[data-test="source"]')
    .click('div[data-test="open-console"]')
    // done with giving signup data
    .getCookies(CONSOLE_URL)
    .end()
}
