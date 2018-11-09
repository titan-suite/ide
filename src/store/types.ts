export interface RootState {
  sidebar: SidebarState
  workspace: IdeState
}
export interface SidebarState {
  compiledCode: string
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
