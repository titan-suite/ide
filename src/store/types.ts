import { ContractAbi } from 'ethereum-types'
export interface RootState {
  compile: CompileState
  deploy: DeployState
  workspace: IdeState
}
export interface CompileState {
  compiledCode: {
    [key: string]: CompiledCode;
  }
  solVersions: SolVersions[]
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
export interface DeployState {
  txDetails: { [key: string]: any }
}
export interface IdeState {
  activeWorkSpaceIndex: number
  workSpaces: WorkSpaceState[]
}
export interface WorkSpaceState {
  name: string
  folders: File[]
  activeFile: File
  openFileNames: string[]
  editorOptions: EditorOptions
}
export interface File {
  name: string
  code: string
  path: string
}
export interface EditorOptions {
  tabSize: number
  mode: string
  theme: string
  lineNumbers: boolean
  line: boolean
  gutters: string[]
}
