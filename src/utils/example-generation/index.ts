import fakeIDL from './fake_idl'
import { fakeSchema } from './fake_schema'
import {
  Source,
  parse,
  concatAST,
  buildASTSchema,
  execute,
  printSchema,
} from 'graphql'

const fakerIDL = parse(fakeIDL)

export function getFakeSchema(schema) {
  const idl = parse(printSchema(schema))
  const ast = concatAST([idl, fakerIDL])

  const newSchema = buildASTSchema(ast)
  fakeSchema(newSchema)

  return newSchema
}

// needs a faked schema
// fakeSchema(schema)
export function getExampleEvent(schema, query: string) {
  try {
    const queryAst = parse(query)

    return execute(schema, queryAst)
  } catch (e) {
    // not empty
  }

  return null
}
