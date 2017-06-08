import Chromeless from 'chromeless'
import {CONSOLE_URL, runRemote} from './config'

export default async (cookies: any[]): Promise<any> => {

  const chromeless = new Chromeless({
    useArtificialClick: true,
    runRemote,
  })

  return chromeless
    .setCookies(cookies, CONSOLE_URL)
    .goto(CONSOLE_URL)
    .wait(3000)
    .wait('.playground-button')
    .click('.playground-button')
    .wait(1000)
    .click('.tab.plus')
    .type(`{`)
    .sendKeyCode(32, undefined, 2)
    .wait(100)
    .click('.CodeMirror-hint-active')
    .end()

}
