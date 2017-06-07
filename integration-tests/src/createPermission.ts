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

    .click('a[data-test="sidenav-permissions"]')
    .wait(1000)
    .click('a[data-test="new-permission-User"]')
    .wait(1000)
    .wait('div[data-test="choose-operation-CREATE"]')
    .click('div[data-test="choose-operation-CREATE"]')
    // skip affected fields
    .wait(200)
    .wait('.next .next-name')
    .click('.next .next-name')

    // set permission conditions
    .wait(200)
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
    .evaluate(() => {
      const rows = document.querySelectorAll('a[data-test="edit-permission-button-User"]')
      const lastRow = rows[rows.length - 1]
      return lastRow.firstElementChild.firstElementChild.innerHTML
    })
    .end()

}
