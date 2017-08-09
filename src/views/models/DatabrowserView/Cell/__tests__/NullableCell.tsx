import * as React from 'react' // tslint:disable-line
import NullableCell from '../NullableCell'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import { TypedValue } from '../../../../../types/utils'

test('NullableCell renders', () => {
  const save = jest.fn((value: TypedValue) => {
    /* */
  })
  const component = shallow(<NullableCell save={save} cell={null} />)

  expect(shallowToJson(component)).toMatchSnapshot()
})
