const fs = require('fs')
const path = require('path')
const env = require('../config/env')

const groups = {}
for (const key in env.schema) {
  const keySchema = env.schema[key]
  const group = key.substring(0, 3)

  if (!groups[group]) {
    groups[group] = { [key]: keySchema }
  } else {
    groups[group][key] = keySchema
  }
}

let envContent = ''
for (const group in groups) {
  for (const key in groups[group]) {
    const flags = groups[group][key].flags
    envContent += `${key}=${flags.default ?? ''}\n`
  }
  envContent += '\n'
}

const dir = path.join(process.cwd(), '.dev.env')

fs.writeFileSync(dir, envContent.trim())
