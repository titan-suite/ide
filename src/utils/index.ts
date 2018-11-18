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

export const shortenAddress = (address: string): string => {
  const len = address.length
  return `${address.slice(0, 5)}...${address.slice(len - 5, len)}`
}

export * from './constants'
