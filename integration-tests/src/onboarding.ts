import Chromeless from 'chromeless'
import {CONSOLE_URL, runRemote} from './config'

export default (cookies: any[]): Promise<any> =>  {
  const chromeless = new Chromeless({
    useArtificialClick: true,
    runRemote,
  })

  return chromeless
    .setCookies(cookies, CONSOLE_URL)
    .goto(CONSOLE_URL)
    .wait(2500)
    .wait('div[data-test="start-onboarding"]')
    .click('div[data-test="start-onboarding"]')
    .wait(1000)
    .click('.add-type')
    .wait(200)
    .type('Post', '.name-input')
    .wait(200)
    .wait('.button.save')
    .click('.button.save')
    .wait(1000)
    .wait('a[data-test="add-post-field"] .add-button')
    .click('a[data-test="add-post-field"] .add-button')
    .wait('input.fieldNameInputField')
    .type('imageUrl', 'input.fieldNameInputField')
    .wait(500)
    .click('div[data-test="string-type"] div')
    .wait(500)
    .click('.buttons div.button.active')
    .wait(1800)
    .wait('a[data-test="add-post-field"]')
    .click('a[data-test="add-post-field"]')
    .wait('input.fieldNameInputField')
    .type('description', 'input.fieldNameInputField')
    .wait(500)
    .click('div[data-test="string-type"]')
    .wait(500)
    .click('.buttons div.button')
    .wait(1800)
    .click('.playground-button')
    .wait(2000)
    .wait('.CodeMirror')
    .wait(200)
    .backspace(2)
    .wait(1000)
    .click('.graphcool-execute-button')
    .wait(1000)
    .click('.tab.plus')
    // execute mutation
    .wait(1000)
    .click('.tether-content .btn')
    .wait(500)
    .click('.graphcool-execute-button')
    .wait(1000)
    .click('.tether-content .btn')
    .wait(500)
    .click('.graphcool-execute-button')
    .wait(1000)
    .click('.tabs .tab')
    // execute query again
    .wait(500)
    .click('.graphcool-execute-button')
    .wait(2000)
    .wait('.bottom .skip')
    .click('.bottom .skip')
    .wait(1000)
    .wait('div[data-test="close-popup"]')
    .click('div[data-test="close-popup"]')

    .end()

}
