export interface RootState {}
export interface SidebarState {}
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
}
