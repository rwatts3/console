import * as moment from 'moment'
import {ISO8601} from './constants'

export function randomString(length: number): string {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export function isValidUrl(str: string): boolean {
  const pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  return pattern.test(str)
}

export function isValidMutationCallbackUrl(str: string): boolean {
  const blackList = [
    '127.0.0.1',
    '0.0.0.0',
    'localhost',
  ]
  const withoutProtocol = str.replace(/http(s)?:\/\//, '')
  return !blackList.includes(withoutProtocol) && (isValidUrl(str) || isValidIp(withoutProtocol))
}

export function isValidIp(str: string): boolean {
  const i = str.indexOf('/')
  const withoutSlash = str.slice(0, i)
  const pattern = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
  return pattern.test(withoutSlash)
}

export function isValidDateTime(dateTime: string): boolean {
  // returns whether the string conforms to ISO8601
  // the strict format is '2016-05-19T17:09:24.123Z' but we also accept simpler versions like '2016'
  return moment.utc(dateTime, ISO8601).isValid()
}

export function isValidEnum(value: string): boolean {
  return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(value)
}

export function debounce(func, wait) {
  let timeout
  return (...args) => {
    const context = this
    const later = () => {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

interface RetryUntilDoneOptions {
  maxRetries?: number
  timeout?: number
}

export function retryUntilDone(fn: (done: () => void) => void, options: RetryUntilDoneOptions = {}): void {
  const maxRetries = options.maxRetries || 100
  const timeout = options.timeout || 100

  let tries = 0
  let shouldBreak = false

  let interval = setInterval(
    () => {
      tries++

        fn(() => {
        clearInterval(interval)
      })

      if (tries < maxRetries) {
        clearInterval(interval)
      }
    },
    timeout,
  )

}

export function lowercaseFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function uppercaseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function removeDuplicatesFromStringArray(arr: string[]): string[] {
  let s = new Set(arr)
  let it = s.values()
  return Array.from(it)
}
