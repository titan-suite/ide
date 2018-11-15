import { MutationTree, GetterTree, ActionTree } from 'vuex'
import {
  IdeState,
  File,
  Folder,
  Tree,
  Workspace,
  RootState,
  EditorOptions
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
  path: '/testToken'
}

const defaultFolder: Folder = {
  index: 0,
  name: 'Example',
  files: [
    defaultFile,
    {
      index: 1,
      name: 'Ballot.sol',
      code: 'pragma solidity ^0.4.9; contract Ballot{}',
      path: '/ballot'
    },
    {
      index: 2,
      name: 'Example.sol',
      code: `pragma solidity ^0.4.9;
      contract Example {
          uint128 public num = 5;
          event NumChanged (uint128);
          function add(uint128 a) public returns (uint128) {
              return num+a;
          }
          function setA(uint128 a) public {
              num = a;
              NumChanged(num);
          }}
        contract WithConstructor {
        uint128 public num = 5;
        event NumChanged (uint128);
        function add(uint128 a) public returns (uint128) {
            return num+a;
        }
        function WithConstructor(uint128 a, bytes32 br) public {
          num = a;
        }
        function setA(uint128 a) public {
            num = a;
            NumChanged(num);
        }}
        contract Types {
    
    function Types(address a, bytes32 b, bool c, uint d, string e, int f, address[] aa, bytes32[]bb, bool[] cc, uint[] ee, int[] ff) public {
        // bytes32, bytes31,...,bytes2, bytes
        // uint, uint256, uint248, uint240,...uint16, uint8
        // int, int256, int248, int240,...,int16, int8
    }
    
}`,
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
  activeFile: defaultFile,
  openFiles: [defaultFile],
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
  activeFile(state, getters): File {
    return getters.activeWorkspace.activeFile
  },
  editorOptions(state): EditorOptions {
    return state.workspaces[state.activeWorkspaceIndex].editorOptions
  },
  openFiles(state, getters): any[] {
    return getters.activeWorkspace.openFiles
  }
}

const mutations: MutationTree<IdeState> = {
  updateFolder(state, payload: File) {
    state.workspaces[state.activeWorkspaceIndex].projectTree.folders[
      state.workspaces[state.activeWorkspaceIndex].activeFolderIndex
    ].files.push(payload)
  },
  setOpenFiles(state, payload: File[]) {
    console.log(payload)
    state.workspaces[state.activeWorkspaceIndex].openFiles = payload
    console.log(state.workspaces[state.activeWorkspaceIndex].openFiles)
  },
  setActiveFile(state, payload: File) {
    state.workspaces[state.activeWorkspaceIndex].activeFile = payload
  },
  setActiveFileCode(state, payload: string) {
    state.workspaces[state.activeWorkspaceIndex].activeFile!.code = payload
  },
  showTab(state, payload: File) {
    const openFiles = state.workspaces[state.activeWorkspaceIndex].openFiles
    console.log(openFiles, payload)
    let exists = false
    openFiles!.map((f: File) => {
      if (f.path === payload.path) {
        exists = true
      }
    })
    if (!exists) {
      openFiles!.push(payload)
      console.log(openFiles, payload)
    }
  }
}

const actions: ActionTree<IdeState, RootState> = {
  addFile(
    { state, rootState, commit, dispatch, getters, rootGetters },
    payload
  ) {
    const projectFiles: File[] = getters.projectTree.folders[0].files
    const file: File = {
      index: projectFiles.length,
      name: payload,
      code: 'pragma solidity ^0.4.9;',
      path: ''
    }
    commit('updateFolder', file)
  }
}

const workspace = {
  namespaced: true,
  state: ideState,
  getters: ideGetters,
  mutations,
  actions
}

export default workspace
