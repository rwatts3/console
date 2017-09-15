const {buildSchema} = require('graphql')
const fs = require('fs')

const file = fs.readFileSync('./schema.graphql', 'utf-8')
const bbefore = Date.now()
console.log(`Took ${Date.now() - bbefore}ms to parse the json`)

const before = Date.now()
const schema = buildSchema(file)
const after = Date.now()

console.log(`Took ${after - before}ms to bulid the client schema`)
console.log(`${after - bbefore}ms in total`)
console.log(schema)
// fs.writeFileSync('schema.graphql', schema)

