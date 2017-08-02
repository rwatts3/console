import Chromeless from 'chromeless'
import { config, CONSOLE_URL } from '../config'
import * as fs from 'fs'

export default async (cookies: any[]): Promise<any> =>  {
  const chromeless = new Chromeless({
    ...config,
  })

  const screenshot = await chromeless
    .cookiesSet(cookies)
    .goto(CONSOLE_URL)
    .wait(3600)
    .wait('div[data-test="start-onboarding"]')
    .click('div[data-test="start-onboarding"]')
    .wait(2100)
    .click('.add-type')
    .wait(700)
    .type('Post', '.name-input')
    .wait(700)
    .wait('.button.save')
    .click('.button.save')
    .wait(2000)
    .wait(2000)
    .wait(2000)
    .click('a[data-test="add-post-field"] .add-button')
    // .evaluate(() => document.querySelector('a[data-test="add-post-field"] .add-button').click())
    .wait(1100)
    .screenshot()

    const screenshot2 = await chromeless
    .type('imageUrl', 'input.fieldNameInputField')
    .wait(600)
    .click('div[data-test="string-type"] div')
    .wait(900)
    .click('.buttons div.button.active')
    .wait(1900)
    .click('a[data-test="add-post-field"]')
    .type('description', 'input.fieldNameInputField')
    .wait(1000)
    .click('div[data-test="string-type"]')
    .wait(900)
    .click('.buttons div.button')
    .wait(1900)
    .click('.playground-button')
    .wait(2100)
    .wait('.CodeMirror')
    .wait(300)
    .press(8, 2)
    .press(8, 2)
    .wait(2500)
    .screenshot()
  console.log('screenshot 2', screenshot2)

    await chromeless
    .click('.graphcool-execute-button')
    .wait(2000)
    .click('body .tabs .tab.plus svg')
    // execute mutation
    .wait(1100)
    .click('.tether-content .btn')
    .wait(1600)
    .click('.graphiql-wrapper:last-child .graphcool-execute-button svg')
    .click('.tether-content .btn')
    .wait(1100)
    .click('.graphiql-wrapper:last-child .graphcool-execute-button')
    .wait(1100)
    .click('.tabs .tab')
    // execute query again
    .wait(900)
    .click('.graphcool-execute-button')
    .wait(3100)
    .wait('.bottom .skip')
    .click('.bottom .skip')
    .wait(1000)
    .click('div[data-test="close-popup"]')
    .wait(2000)
    .screenshot()

}
