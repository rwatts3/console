import Chromeless from 'chromeless'
import {CONSOLE_URL, runRemote, waitTimeout} from './config'

export default async (cookies: any[]): Promise<any> =>  {

  const chromeless = new Chromeless({
    useArtificialClick: true,
    runRemote,
    waitTimeout,
  })

  return chromeless
    .setCookies(cookies, CONSOLE_URL)
    .goto(CONSOLE_URL)
    .wait(3000)
    .wait('div[data-test="logo"]')
    .click('div[data-test="logo"]')
    .wait('div[data-test="add-project-button"]')
    .click('div[data-test="add-project-button"]')
    .wait('input[data-test="project-name-input"]')
    .type('Very Long Test Project Name')
    .click('div[data-test="submit-add-project-button"]')
    .wait(5000)
    .evaluate(() => document.querySelector('.project-name').innerHTML)
    .end()

}
