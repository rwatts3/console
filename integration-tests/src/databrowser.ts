import Chromeless from 'chromeless'
import {CONSOLE_URL, runRemote, waitTimeout} from './config'

export default async (cookies: any[]): Promise<any> => {

  const chromeless = new Chromeless({
    useArtificialClick: true,
    runRemote,
    waitTimeout,
  })

  return chromeless
    .setCookies(cookies, CONSOLE_URL)
    .goto(CONSOLE_URL)
    .wait(3000)
    .wait('a[data-test="sidenav-databrowser"]')
    .click('a[data-test="sidenav-databrowser"]')
    .wait(1000)
    .wait('a[data-test="sidenav-databrowser-model-Post"]')
    .click('a[data-test="sidenav-databrowser-model-Post"]')
    .wait(2000)
    .type('test url')
    .evaluate(() => document.querySelector('div[data-test="new-row-cell-imageUrl"] input').blur())
    .click('div[data-test="new-row-cell-description"] > div > div')
    .wait(200)
    .wait('div[data-test="new-row-cell-description"] input')
    .type('some description', 'div[data-test="new-row-cell-description"] input')
    .evaluate(() => document.querySelector('div[data-test="new-row-cell-description"] input').blur())
    .click('button[data-test="add-node"]')
    .wait(500)
    .click('div[data-test="edit-field-imageUrl"]')
    .click('div[data-test="cell-imageUrl"]')
    .type('123')
    .sendKeyCode(13, 'input')
    .wait(200)
    .click('div[data-test="checkbox-row-0"]')
    .wait(200)
    .click('div[data-test="delete-button"]')
    .wait(200)
    .click('div.button.warning')
    .end()

}
