import { ContractAbi } from 'ethereum-types'
export interface RootState {
  compile: CompileState
  deploy: DeployState
  workspace: IdeState
}
export interface CompileState {
  compiledCode: {
    [key: string]: {
      code: string;
      info: ContractInfo;
    };
  }
  solVersions: SolVersions[]
}
export interface SolVersions {
  value: string
  label: string
}
export interface ContractInfo {
  abiDefinition: ContractAbi[]
  compilerVersion: string
  language: string
  languageVersion: string
  source: string
}
export interface DeployState {
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
