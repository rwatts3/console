import Chromeless from 'chromeless'
import { config, CONSOLE_URL } from '../config'

export default async (cookies: any[]): Promise<any> => {

  const chromeless = new Chromeless({
    ...config,
  })

  const result = await chromeless
    .setCookies(cookies)
    .goto(CONSOLE_URL)
    .wait(3200)
    .wait('a[data-test="sidenav-databrowser"]')
    .click('a[data-test="sidenav-databrowser"]')
    .wait(2200)
    .wait('a[data-test="sidenav-databrowser-model-Post"]')
    .click('a[data-test="sidenav-databrowser-model-Post"]')
    .wait(2200)
    .click('div[class^="NewRowInactive__add"]')
    .type('test url')
    // .evaluate(() => document.querySelector('div[data-test="new-row-cell-imageUrl"] input').blur())
    // .click('div[data-test="new-row-cell-description"] > div > div')
    .press(9)
    .wait(400)
    .wait('div[data-test="new-row-cell-description"] input')
    .type('some description', 'div[data-test="new-row-cell-description"] input')
    // .evaluate(() => document.querySelector('div[data-test="new-row-cell-description"] input').blur())
    .wait(700)
    .click('button[data-test="add-node"]')
    .wait(300)
    .click('div[data-test="edit-field-imageUrl"]')
    .click('div[data-test="cell-imageUrl"]')
    .type('123')
    .wait(500)
    .evaluate(() => document.querySelector('input').click())
    .wait(500)
    .press(13)
    .wait(400)
    .click('div[data-test="checkbox-row-0"]')
    .wait(400)
    .click('div[data-test="delete-button"]')
    .wait(400)
    .click('div.button.warning')
    .end()

}
