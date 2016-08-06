///<reference path="../../../node_modules/@types/jest/index.d.ts"/>
/* eslint-disable */
jest.unmock('../valueparser')
jest.unmock('../graphql')
jest.unmock('../../types/types')

import { Field } from '../../types/types'
import { stringToValue, valueToString } from '../valueparser'
import '../polyfils'

const testField: Field = {
  id: '',
  name: '',
  description: '',
  isRequired: true,
  isList: false,
  isUnique: false,
  isSystem: false,
  typeIdentifier: '',
  enumValues: [],
  permissions: null,
  model: null,
}

describe('stringToValue', () => {
  it('parses empty int', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Int',
    })
    console.log(field)
    expect(stringToValue('', field)).toBe(null)
  })

  it('parses int', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Int',
    })
    expect(stringToValue('23', field)).toBe(23)
  })

  it('parses negative int', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Int',
    })
    expect(stringToValue('-23', field)).toBe(-23)
  })

  it('parses empty float when required', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Float',
    })
    expect(stringToValue('', field)).toBe(null)
  })

  it('parses float when required', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Float',
    })
    expect(stringToValue('23.32', field)).toBe(23.32)
  })

  it('parses negative float when required', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Float',
    })
    expect(stringToValue('-23.32', field)).toBe(-23.32)
  })

  it('parses empty float when not required', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: false,
      isList: false,
      typeIdentifier: 'Float',
    })
    expect(stringToValue('', field)).toBe(null)
  })

  it('parses float when not required', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: false,
      isList: false,
      typeIdentifier: 'Float',
    })
    expect(stringToValue('23.32', field)).toBe(23.32)
  })

  it('parses string', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'String',
    })
    expect(stringToValue('abc', field)).toBe('abc')
  })

  it('parses numeric string', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'String',
    })
    expect(stringToValue('12', field)).toBe('12')
  })

  it('parses empty string when not required', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: false,
      isList: false,
      typeIdentifier: 'String',
    })
    expect(stringToValue('', field)).toBe(null)
  })

  it('parses empty string when required', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'String',
    })
    expect(stringToValue('', field)).toBe('')
  })

  it('parses empty boolean', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    })
    expect(stringToValue('', field)).toBe(null)
  })

  it('parses boolean true', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    })
    expect(stringToValue('true', field)).toBe(true)
  })

  it('parses boolean false', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    })
    expect(stringToValue('false', field)).toBe(false)
  })

  it('parses empty int list', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: true,
      typeIdentifier: 'Int',
    })
    expect(stringToValue('[]', field)).toEqual([])
  })

  it('parses int list', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: true,
      typeIdentifier: 'Int',
    })
    expect(stringToValue('[1,3]', field)).toEqual([1, 3])
  })

  it('parses relation id', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'SomeModel',
    })
    expect(stringToValue('someId', field)).toEqual({ id: 'someId' })
  })

  it('parses GraphQLID', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'GraphQLID',
    })
    expect(stringToValue('someId', field)).toBe('someId')
  })

  it('parses GraphQLID list', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: true,
      typeIdentifier: 'GraphQLID',
    })
    expect(stringToValue('["id","id2"]', field)).toEqual(['id', 'id2'])
  })
})

describe('valueToString', () => {
  // TODO
})

describe('identities', () => {
  it('is an identity to convert an int value to a string and back to int', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Int',
    })
    expect(stringToValue(valueToString(12, field, true), field)).toBe(12)
  })

  it('is an identity to convert a Float value to a string and back to Float', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Float',
    })
    expect(stringToValue(valueToString(23.23, field, true), field)).toBe(23.23)
  })

  it('is an identity to convert a string value to a string back to string', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'String',
    })
    expect(stringToValue(valueToString('12', field, true), field)).toBe('12')
  })

  it('is an identity to convert a Boolean value to a string and back to Boolean', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    })
    expect(stringToValue(valueToString(true, field, true), field)).toBe(true)
  })

  it('is an identity to convert a string to an Int value and back to string', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Int',
    })
    expect(valueToString(stringToValue('12', field), field, true)).toBe('12')
  })

  it('is an identity to convert a string to a Float value and back to string', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Float',
    })
    expect(valueToString(stringToValue('23.23', field), field, true)).toBe('23.23')
  })

  it('is an identity to convert a string value to a string back to string', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'String',
    })
    expect(valueToString(stringToValue('12', field), field, true)).toBe('12')
  })

  it('is an identity to convert a string to a Boolean value and back to string', () => {
    const field: Field = Object.assign({}, testField, {
      isRequired: true,
      isList: false,
      typeIdentifier: 'Boolean',
    })
    expect(valueToString(stringToValue('true', field), field, true)).toBe('true')
  })
})
