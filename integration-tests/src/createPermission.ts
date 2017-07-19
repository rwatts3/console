import Chromeless from 'chromeless'
import {CONSOLE_URL, runRemote, waitTimeout} from './config'

export default async (cookies: any[]): Promise<any> => {

  const chromeless = new Chromeless({
    useArtificialClick: true,
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
    .click('a[data-test="new-permission-Post"]')
    .wait(1000)
    .wait('div[data-test="choose-operation-CREATE"]')
    .click('div[data-test="choose-operation-CREATE"]')
    // skip affected fields
    .wait(500)
    .wait('.next .next-name')
    .click('.next .next-name')

    .wait(500)
    // click apply to whole type
    .click('.intro + .info > div')
    .wait(200)
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
    .eval.code(() => {
      const rows = document.querySelectorAll('a[data-test="edit-permission-button-Post"]')
      const lastRow = rows[rows.length - 1]
      return lastRow.firstElementChild.firstElementChild.innerHTML
    })

}
