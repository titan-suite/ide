const Web3Provider = 'Web3 Provider'
const InjectedWeb3 = 'Injected Web3'
const AION = 'Aion'
const ETHEREUM = 'Ethereum'

export const getPadLength = (blockchain: string) => {
  switch (blockchain) {
    case AION:
      return 32
    case ETHEREUM:
      return 64
    default:
      throw new Error('Invalid blockchain')
  }
}
export const getUnits = (blockchain: string) => {
  switch (blockchain) {
    case AION:
      return [
        {
          value: 'nAmp',
          label: 'nAmp'
        },
        {
          value: 'uAmp',
          label: 'uAmp'
        },
        {
          value: 'mAmp',
          label: 'mAmp'
        },
        {
          value: 'Amp',
          label: 'Amp'
        },
        {
          value: 'uAION',
          label: 'uAION'
        },
        {
          value: 'mAION',
          label: 'mAION'
        },
        {
          value: 'cAION',
          label: 'cAION'
        },
        {
          value: 'dAION',
          label: 'dAION'
        },
        {
          value: 'AION',
          label: 'AION'
        }
      ]
    case ETHEREUM:
      return [
        {
          value: 'wei',
          label: 'Wei'
        },
        {
          value: 'gwei',
          label: 'Gwei'
        },
        {
          value: 'finney',
          label: 'Finney'
        },
        {
          value: 'ether',
          label: 'Ether'
        }
      ]

    default:
      throw new Error('Invalid blockchain')
  }
}
export const BLOCKCHAINS = { AION, ETHEREUM }
export const PROVIDERS = { Web3Provider, InjectedWeb3 }
