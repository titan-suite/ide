import { ContractAbi } from 'ethereum-types'
import { Contract } from 'typechain/dist/parser/abiParser'

export interface RootState {
  compile: CompileState
  run: RunState
  workspace: IdeState
}
export interface CompileState {
  compiledCode: {
    [key: string]: CompiledCode;
  }
  solVersions: SolVersions[]
  contracts: {
    [key: string]: Contract;
  }
  nodeAddress: string
  selectedContract: string
  selectedSolVersion: string
  isConnectedToNode: boolean
}
export interface CompiledCode {
  code: string
  info: ContractInfo
}
export interface SolVersions {
  value: string
  label: string
}
export interface ContractInfo {
  abiDefinition: ContractAbi
  compilerVersion: string
  language: string
  languageVersion: string
  source: string
}
export interface RunState {
  // environment: any
  accountsLoading: boolean
  selectedAccount: string
  accounts: Account[]
  gasLimit: number
  value: Value
  units: Unit[]
  deployedContract: any
}
export interface Unit {
  value: string
  label: string
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
  activeFileCode: string
  openFileIndices: number[]
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
export interface ActiveFile {
  folderIndex: number
  fileIndex: number
  code: string
}
export interface Node {
  index: number
  label: string
  path: string
  type: string
  children?: Node[]
  code?: string
}
