import Chromeless from 'chromeless'
import {CONSOLE_URL, runRemote} from './config'

export default async (cookies: any[]): Promise<any> =>  {

  const chromeless = new Chromeless({
    useArtificialClick: true,
    runRemote,
  })

  return chromeless
    .setCookies(cookies, CONSOLE_URL)
    .goto(CONSOLE_URL)
    .wait(3000)
    .wait('a[data-test="sidenav-functions"]')
    .click('a[data-test="sidenav-functions"]')
    .wait(1000)
    .wait('a[data-test="create-function-button"]')
    .click('a[data-test="create-function-button"]')
    .wait('div[data-test="choose-sss"]')
    .click('div[data-test="choose-sss"]')
    .wait('.next .next-name')
    .click('.next .next-name')
    .wait(500)
    .evaluate(() => document.querySelector('input[data-test="function-name-input"]').focus())
    .type('Test SSS Function', 'input[data-test="function-name-input"]')
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(2000)
    .wait('a[data-test="edit-sss-function-button"]')
    .click('a[data-test="edit-sss-function-button"]')
    .wait(1000)
    .wait('pre.CodeMirror-line')
    .click('pre.CodeMirror-line')
    .type('  ')
    .wait(200)
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(1000)
    .wait('a[data-test="edit-sss-function-button"]')
    .click('a[data-test="edit-sss-function-button"]')
    .wait(1000)
    .wait('.popup-footer .delete')
    .click('.popup-footer .delete')
    .end()

}
