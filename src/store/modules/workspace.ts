import { MutationTree, GetterTree, Getter } from 'vuex'
import {
  IdeState,
  File,
  Folder,
  Tree,
  Workspace,
  RootState,
  EditorOptions,
  ActiveFile
} from '../types'

const defaultFile: File = {
  index: 0,
  name: 'TestToken.sol',
  code: `pragma solidity ^0.4.9;

/**
 * @title Hello
 * @dev Simple contract
 */

contract Hello {
  
  uint data = 100;

  function getData() public returns (uint) {
    return data;
  }
}
`,
  path: '/'
}

const defaultFolder: Folder = {
  index: 0,
  name: 'Hello',
  files: [
    defaultFile,
    {
      index: 1,
      name: 'Ballot',
      code: 'pragma solidity ^0.4.9; contract Ballot{}',
      path: '/ballot'
    },
    {
      index: 2,
      name: 'Test',
      code: 'pragma solidity ^0.4.9; contract Test{}',
      path: '/test'
    }
  ],
  path: '/',
  activeFileIndex: 0
}

const projectTree: Tree = {
  folders: [defaultFolder]
}

const editorOptions: EditorOptions = {
  tabSize: 4,
  mode: 'text/javascript',
  theme: 'monokai',
  lineNumbers: true,
  line: true,
  gutters: ['CodeMirror-linenumbers', 'breakpoints']
}

const defaultWorkspace: Workspace = {
  index: 0,
  name: 'Project 1',
  projectTree,
  activeFolderIndex: 0,
  openFileIndices: [0],
  editorOptions
}

const ideState: IdeState = {
  activeWorkspaceIndex: 0,
  workspaces: [defaultWorkspace]
}

const ideGetters: GetterTree<IdeState, RootState> = {
  activeWorkspace(state): Workspace {
    return state.workspaces[state.activeWorkspaceIndex]
  },
  projectTree(state, getters): Tree {
    return getters.activeWorkspace.projectTree
  },
  folderById(state, getters): (folderIndex: number) => Folder {
    return (folderIndex: number) => {
      return getters.projectTree.folders.find(
        (f: Folder) => f.index === folderIndex
      )
    }
  },
  fileById(state, getters): (folderIndex: number, fileIndex: number) => File {
    return (folderIndex: number, fileIndex: number) => {
      return getters
        .folderById(folderIndex)
        .files.find((f: File) => f.index === fileIndex)
    }
  },
  code(state): string {
    return state.workspaces[state.activeWorkspaceIndex].projectTree.folders[0]
      .files[0].code
  },
  editorOptions(state): EditorOptions {
    return state.workspaces[state.activeWorkspaceIndex].editorOptions
  }
}

const mutations: MutationTree<IdeState> = {
  addFile(state, payload: string) {
    // state.code = payload
  },
  addFolder(state, payload: string) {
    // state.code = payload
  },
  removeFile(state, payload: string) {
    // state.code = payload
  },
  removeFolder(state, payload: string) {
    // state.code = payload
  },
  moveFile(state, payload: string) {
    // state.code = payload
  },
  moveFolder(state, payload: string) {
    // state.code = payload
  },
  setActiveFileContent(state, payload: ActiveFile) {
    console.log('in state' + JSON.stringify(payload))
    // state.workspaces[state.activeWorkspaceIndex].activeFile.code = payload
    const { folderIndex, fileIndex } = payload
    state.workspaces[state.activeWorkspaceIndex].projectTree.folders[
      folderIndex
    ].files[fileIndex].code =
      payload.code
  }
  // setActiveFileIndex(state, payload: number) {
  //   console.log('in state' + JSON.stringify(payload))
  //   state.workspaces[state.activeWorkspaceIndex].activeFile.code = payload
  // }
}

const workspace = {
  namespaced: true,
  state: ideState,
  getters: ideGetters,
  mutations
}

export default workspace
