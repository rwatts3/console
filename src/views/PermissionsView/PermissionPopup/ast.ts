import {parse, visit} from 'graphql'

import {PermissionVariable} from '../../../types/types'
export function putVariablesToQuery(query: string, variables: PermissionVariable[]) {
  let newQuery = query

  try {
    let ast = parse(query)
    let nameEnd = -1
    let selectionStart = -1

    visit(ast, {
      Name(node) {
        if (nameEnd === -1) {
          nameEnd = node.loc.end
        }
      },
      SelectionSet(node) {
        if (selectionStart === -1) {
          selectionStart = node.loc.start
        }
      },
    })

    newQuery = query.slice(0, nameEnd) + renderVariables(variables) + query.slice(selectionStart, query.length)
  } catch (e) {
    //
  }

  return newQuery
}

export function getVariableNamesFromQuery(query: string): string[] {
  let variables = []

  try {
    let ast = parse(query)

    visit(ast, {
      VariableDefinition(node) {
        variables.push(node.variable.name.value)
      },
    })
  } catch (e) {
    //
  }

  return variables
}

function renderVariables(variables: PermissionVariable[]) {
  if (variables.length === 0) {
    return ' '
  }
  return '(' +
    variables.map(variable => (
      `$${variable.name}: ${renderType(variable)}`
    )).join(', ') +
    ') '
}

export function renderType(variable: PermissionVariable) {
  const type = variable.typeIdentifier + (variable.isRequired ? '!' : '')
  return (variable.isList ? `[${type}]` : type)
}
