import { MethodAbi } from 'ethereum-types'

export const parseDeployedContract = (
  contractName: string,
  contractAddress: string,
  abi: MethodAbi[]
) => {
  return {
    contractAddress,
    title: `${contractName} at ${shortenAddress(contractAddress)}`,
    abi: abi
      .filter(i => i.type !== 'constructor' && i.type !== 'event')
      .map(piece => {
        return {
          ...piece,
          combinedInputs: combineInputs(piece.inputs),
          loading: false,
          argsModel: '',
          res: undefined
        }
      })
  }
}

export const combineInputs = (
  inputs: Array<{ name: string; type: string }>
) => {
  return inputs
    .map(({ name, type }) => {
      return `${type.trim()} ${name.trim()}`
    })
    .join(',')
}

export const extractConstructor = (abiDefinition: MethodAbi[]) => {
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
