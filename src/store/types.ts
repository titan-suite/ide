export interface RootState {}
export interface SidebarState {}
export interface WorkspaceState {
  name: string
  folders: File[]
  activeFile: File
  openFileNames: string[]
  editorOptions: any
}
export interface File {
  name: string
  code: string
  path: string
}
