const {buildClientSchema} = require('graphql')
const fs = require('fs')

const file = fs.readFileSync('./schema.json')
const bbefore = Date.now()
const json = JSON.parse(file)
console.log(`Took ${Date.now() - bbefore}ms to parse the json`)

const before = Date.now()
const schema = buildClientSchema(json.data)
const after = Date.now()

console.log(`Took ${after - before}ms to bulid the client schema`)
console.log(`${after - bbefore}ms in total`)
