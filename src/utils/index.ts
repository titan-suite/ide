import { RawAbiDefinition } from 'typechain/dist/parser/abiParser'

export const combineInputs = (
  inputs: Array<{ name: string; type: string }>
) => {
  return inputs
    .map(({ name, type }) => {
      return `${type.trim()} ${name.trim()}`
    })
    .join(',')
}

export const parseSignature = (
  name: string,
  inputs: Array<{ name: string; type: string }>
) => {
  return `${name}(${inputs
    .map(({ type }) => {
      return type.trim()
    })
    .join(',')})`
}

export const extractConstructor = (abiDefinition: RawAbiDefinition[]) => {
  for (const item of abiDefinition) {
    if (item.type === 'constructor') {
      return combineInputs(item.inputs)
    }
  }
  return undefined
}

export const shortenAddress = (address: string): string => {
  const len = address.length
  return `${address.slice(0, 5)}...${address.slice(len - 5, len)}`
}

export * from './constants'
