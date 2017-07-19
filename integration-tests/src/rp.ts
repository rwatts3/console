import Chromeless from 'chromeless'
import {CONSOLE_URL, runRemote, waitTimeout} from './config'

export default async (cookies: any[]): Promise<any> =>  {

  const chromeless = new Chromeless({
    useArtificialClick: true,
    runRemote,
    waitTimeout,
  })

  await chromeless
    .goto(CONSOLE_URL)
    .cookies.set(cookies)
    .goto(CONSOLE_URL)
    .wait(3000)
    .wait('a[data-test="sidenav-functions"]')
    .click('a[data-test="sidenav-functions"]')
    .wait(1000)
    .wait('a[data-test="create-function-button"]')
    .click('a[data-test="create-function-button"]')
    .wait('div[data-test="choose-rp"]')
    .click('div[data-test="choose-rp"]')
    .wait('.next .next-name')
    .click('.next .next-name')
    .wait(500)
    .click('div[data-test="pre-write-circle"]')
    .wait(200)
    .wait('.next .next-name')
    .click('.next .next-name')
    .wait(500)
    .eval.code(() => document.querySelector('input[data-test="function-name-input"]').focus())

  return chromeless
    .type('Test RP Function', 'input[data-test="function-name-input"]')
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(2000)
    .wait('a[data-test="edit-rp-function-button"]')
    .click('a[data-test="edit-rp-function-button"]')
    .wait(1000)
    .wait('pre.CodeMirror-line')
    .click('.js-editor')
    .type('  ')
    .wait(200)
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(1000)
    .wait('a[data-test="edit-rp-function-button"]')
    .click('a[data-test="edit-rp-function-button"]')
    .wait(1000)
    .wait('.popup-footer .delete')
    .click('.popup-footer .delete')
    .end()

}
