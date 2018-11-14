import { RawAbiDefinition } from 'typechain/dist/parser/abiParser'

export const extractConstructor = (abiDefinition: RawAbiDefinition[]) => {
  for (const item of abiDefinition) {
    if (item.type === 'constructor') {
      const inputs = item.inputs.map(({ name, type }) => {
        return `${type.trim()} ${name.trim()}`
      })
      return inputs.join(',')
    }
  }
  return undefined
}
