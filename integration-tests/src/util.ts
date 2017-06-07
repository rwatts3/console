import Chromeless from 'chromeless'

export function setCookie(client: Chromeless, cookie: string): Chromeless {
  return client.goto('http://localhost:4000')
    .wait(2000)
    .evaluate(`
      () => {
        document.cookie = '${cookie}';
      }
    `)
    .evaluate(() => {
      location.href = '/'
    })
    .wait(1000)

}