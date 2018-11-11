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
  accounts: string[]
  gasLimit: number
  value: {
    amount: number;
    unit: string;
  }
  txDetails: { [key: string]: any }
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
