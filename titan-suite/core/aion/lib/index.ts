import Web3 from 'aion-web3'
import { ContractAbi, AbiDefinition } from 'ethereum-types'

export const getAccounts = (web3: Web3) => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, acc) => {
      if (err) {
        reject(err)
      }
      resolve(acc)
    })
  })
}
export const getBalance = ({
  address,
}: {
  address: string;
}, web3: Web3) => {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address, (err, balance) => {
      if (err) {
        reject(err)
      }
      resolve(web3.fromWei(balance, 'ether'))
    })
  })
}

export const compile = async ({
  contract,
}: {
  contract: string;
},web3: Web3): Promise<{ [key: string]: any }> => {
  return new Promise((resolve, reject) => {
    web3.eth.compile.solidity(contract, (err: any, res: any) => {
      if (err) {
        return reject(err)
      }
      if ('compile-error' in res) {
        return reject(res['compile-error'].error)
      }
      if (res) {
        return resolve(res)
      }
    })
  })
}

export const unlock = async ({
  mainAccount,
  mainAccountPass
}: {
  mainAccount: string;
  mainAccountPass: string;
}, web3: Web3) => {
  return new Promise((resolve, reject) => {
    web3.personal
      ? web3.personal.unlockAccount(
          mainAccount,
          mainAccountPass,
          999999,
          (err: any, isUnlocked: boolean) => {
            if (err) {
              return reject(err)
            } else if (isUnlocked && isUnlocked === true) {
              return resolve(isUnlocked)
            } else {
              return reject('unlock failed')
            }
          }
        )
      : reject('Invalid Web3')
  })
}

const Web3DeployContract = async ({
  abi,
  code,
  mainAccount,
  gas,
  contractArguments
}: {
  abi: ContractAbi;
  code: string;
  mainAccount: string;
  gas: number;
  contractArguments: string | null | undefined;
}, web3: Web3): Promise<{ abi?: ContractAbi; address?: string }> => {
  return new Promise((resolve, reject) => {

    if (contractArguments && contractArguments.length > 0) {
      web3.eth.contract(abi).new(
        ...contractArguments.split(','),
        {
          from: mainAccount,
          data: code,
          gas
        },
        (err: any, contract: any) => {
          if (err) {
            reject(err)
          } else if (contract && contract.address) {
            resolve(contract)
          }
        }
      )
    } else {
      web3.eth.contract(abi).new(
        {
          from: mainAccount,
          data: code,
          gas
        },
        (err: any, contract: any) => {
          if (err) {
            reject(err)
          } else if (contract && contract.address) {
            resolve(contract)
          }
        }
      )
    }
  })
}

export const deploy = async ({
  abi,
  code,
  mainAccount,
  gas,
  contractArguments
}: {
  abi: AbiDefinition[];
  code: string;
  mainAccount: string;
  gas: number;
  contractArguments: string | null | undefined;
}, web3: Web3) => {
  try {
    const deployedContract = await Web3DeployContract({
      abi,
      code,
      mainAccount,
      gas,
      contractArguments
    },web3)
    console.log('Contract deployed at ', deployedContract.address)
    return deployedContract
  } catch (e) {
    throw e
  }
}
export default Web3