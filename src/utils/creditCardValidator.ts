
export function creditCardNumberValid(creditCardNumber: string): boolean {
  let creditCardNumberWithoutSpaces = creditCardNumber
  if (creditCardNumber.includes(' ')) {
    creditCardNumberWithoutSpaces = creditCardNumberWithoutSpaces.split(' ').join('')
  }
  return creditCardNumberWithoutSpaces.length === 16
}

export function expirationDateValid(expirationDate: string): boolean {
  const components = expirationDate.split('/')

  if (!Number(components[0]) || !Number(components[1])) {
    return false
  }

  if (components.length !== 2) {
    return false
  }

  if (+components[0] > 12) {
    return false
  }

  if (+components[1] < 17) {
    return false
  }

  return true
}

export function cpcValid(cpc: string): boolean {
    return cpc.length === 3
}
