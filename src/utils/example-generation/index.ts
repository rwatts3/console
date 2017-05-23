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
import cuid from 'cuid'

const fakerIDL = parse(fakeIDL)

export function getFakeSchema(schema) {
  const idl = printSchema(schema)
  const patchedIdl = idl.split('\n').map(line => {
    if (line.includes('id: ID!')) {
      // line = line + ` @examples(values: ["${cuid()}", "${cuid()}"])`
      line = line + ` @fake(type: uuid)`
    }
    if (line.includes(': DateTime')) {
      line = line + ` @examples(values: ["2017-05-20T16:22:26.248Z", "2017-05-21T16:22:26.248Z"])`
    }
    if (line.includes('updatedFields')) {
      line = line + ` @examples(values: [["updatedAt"]])`
    }

    return line
  }).join('\n')
  const graphcoolAst = parse(patchedIdl)
  const ast = concatAST([graphcoolAst, fakerIDL])

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

  return Promise.reject(null)
}
