import { Aion, Ethereum } from '@titan-suite/core'

export interface RootState {
  compile: CompileState
  run: RunState
  workspace: IdeState
}
export interface CompileState {
  compiledCode: {
    [key: string]: any
  }
  solVersions: string[]
  contracts: {
    [key: string]: string | undefined
  }
  selectedContract: string
  selectedSolVersion: string
  useInBrowserCompiler: boolean
}

export interface RunState {
  blockchains: { [key: string]: any }
  providers: { [key: string]: any }
  selectedBlockchain: string
  selectedProvider: string
  providerAddress: string
  privateKey: { key: string; address: string } | undefined
  accountsLoading: boolean
  selectedAccount: string
  accounts: Account[]
  gasLimit: number
  gasPrice: number
  value: Value
  contractArgs: string
  receipts: any[]
  deployedContracts: any[]
  providerInstance: undefined | Aion | Ethereum
  isProviderSet: boolean
  isPrivateKeySet: boolean
}
export interface Value {
  amount: number
  unit: string
}
export interface Account {
  address: string
  etherBalance: number
  unlocked: boolean
  loading: boolean
}
export interface IdeState {
  activeWorkspaceIndex: number
  workspaces: Workspace[]
}
export interface Workspace {
  index: number
  name: string
  projectTree: Tree
  activeFolderIndex: number
  activeFile?: File
  openFiles?: File[]
  editorOptions: EditorOptions
}
export interface File {
  index: number
  name: string
  code: string
  path: string
}
export interface Folder {
  index: number
  name: string
  files: File[]
  path: string
  activeFileIndex: number
}
export interface Tree {
  folders: Folder[]
}
export interface EditorOptions {
  tabSize: number
  mode: string
  theme: string
  lineNumbers: boolean
  line: boolean
  gutters: string[]
}
export interface Node {
  index: number
  label: string
  path: string
  type: string
  children?: Node[]
  code?: string
}
