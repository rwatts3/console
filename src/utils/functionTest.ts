import cuid from 'cuid'

export function generateSSSTestEvent(modelName: string) {
  return {
    data: {
      [modelName]: {
        node: {
          id: cuid(),
        },
        updatedFields: ['updatedAt'],
      },
    },
    context: {
      headers: {},
    },
  }
}

export function generateRPTestEvent(definition) {
  return {
    data: definition ? generateTestData(definition) : {},
    context: {
      headers: {},
    },
  }
}

function generateTestData(definition) {
  const fields = extractFields(definition)
  const result = {}
  fields.forEach(field => {
    result[field.name] = dummyData.hasOwnProperty(field.type) ? dummyData[field.type] : ''
  })
  return result
}

function extractFields(definition) {
  const regex = /(.+?):(.+)!?/
  return definition.split('\n').filter(line => regex.test(line)).map(line => {
    const result = regex.exec(line.trim())
    const type = result[2].trim()
    return {
      name: result[1],
      type: type.endsWith('!') ? type.slice(0, type.length - 1) : type,
    }
  })
}

const dummyData = {
  Boolean: true,
  DateTime: new Date().toISOString(),
  String: '',
  ID: cuid(),
  Int: 5,
  Enum: '',
  Json: '{}',
  Float: 5.1,
  Password: '',
  Relation: `{"id":"${cuid()}"}`,
  GraphQLID: cuid(),
}
