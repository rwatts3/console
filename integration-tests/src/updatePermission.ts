import Chromeless from 'chromeless'
import {CONSOLE_URL, runRemote, waitTimeout} from './config'

export default async (cookies: any[]): Promise<any> => {

  const chromeless = new Chromeless({
    useArtificialClick: false,
    runRemote,
    waitTimeout,
  })

  return chromeless
    .goto(CONSOLE_URL)
    .cookies.set(cookies)
    .goto(CONSOLE_URL)
    .wait(3000)
    .wait('a[data-test="sidenav-permissions"]')
    .click('a[data-test="sidenav-permissions"]')
    .wait(1000)
    .click('a[data-test="edit-permission-button-Post"]')
    .wait(1000)
    // click apply to whole type
    .wait('.next .next-name')
    .click('.next .next-name')
    .wait(200)
    .wait('.permission-query-wrapper .after')
    .click('.permission-query-wrapper .after')
    .wait(200)
    .click('div[data-test="button-auth-required"]')
    .wait(500)
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(1000)
    .eval.code(() => document.querySelector('.z5:last-child h3[data-test="permission-row-label"]').innerHTML)

}
