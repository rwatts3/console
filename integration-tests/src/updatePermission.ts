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
    .wait('a[data-test="sidenav-permissions"]')
    .click('a[data-test="sidenav-permissions"]')
    .wait(1000)
    .click('a[data-test="edit-permission-button-User"]')
    .wait(1000)
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
    .evaluate(() => document.querySelector('h3[data-test="permission-row-label"]').innerHTML)
    .end()

}
