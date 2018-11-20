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
  name: 'Example.sol',
  code: `pragma solidity ^0.4.9;

contract Example {
    uint128 public num = 5;

    event NumChanged (uint128);

    function add(uint128 a) public returns (uint128) {
        return num + a;
    }

    function setA(uint128 a) public {
        num = a;
        NumChanged(num);
    }
}`,
  path: '/Example/Example.sol'
}

const defaultFolder: Folder = {
  index: 0,
  name: 'Example',
  files: [
    defaultFile,
    {
      index: 1,
      name: 'WithConstructor.sol',
      code: `pragma solidity ^0.4.9;

contract WithConstructor {
    uint128 public num = 5;

    event NumChanged (uint128);

    function add(uint128 a) public returns (uint128) {
        return num + a;
    }

    function WithConstructor(uint128 a, bytes32 br) public {
        num = a;
    }

    function setA(uint128 a) public {
        num = a;
        NumChanged(num);
    }
}

contract Titan {
    uint128 public num = 5;
    bytes32[] public br;
    address public addr;
    uint[] public ir = [1,2,4];
    mapping(address => string) public map;
    function Example(uint128 a, bytes32 b){
        num=a;
        br.push(b);
    }
    function add(uint128 a) public returns (uint128, bytes32[], uint[]) {
        return (num + a, br, ir);
    }

    function setCR(bytes32[] _br) public {
        br = _br;
    }
    function setTR(uint[] _ir) public {
        ir = _ir;
    }
    function setAddr(address _addr, string _str) public {
        addr = _addr;
        map[_addr] = _str;
    }
}`,
      path: '/Example/WithConstructor.sol'
    }
  ],
  path: '/Example',
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
  editorOptions(state, getters): EditorOptions {
    return getters.activeWorkspace.editorOptions
  },
  openFiles(state, getters): any[] {
    return getters.activeWorkspace.openFiles
  }
}

const mutations: MutationTree<IdeState> = {
  updateFolder(state, payload: File[]) {
    state.workspaces[
      state.activeWorkspaceIndex
    ].projectTree.folders[0].files = payload
  },
  setOpenFiles(state, payload: File[]) {
    state.workspaces[state.activeWorkspaceIndex].openFiles = payload
  },
  setActiveFile(state, payload: File) {
    state.workspaces[state.activeWorkspaceIndex].activeFile = payload
  },
  setActiveFileCode(state, payload: string) {
    state.workspaces[state.activeWorkspaceIndex].activeFile!.code = payload
  },
  showTab(state, payload: File) {
    const openFiles = state.workspaces[state.activeWorkspaceIndex].openFiles
    let exists = false
    openFiles!.map((f: File) => {
      if (f.path === payload.path) {
        exists = true
      }
    })
    if (!exists) {
      openFiles!.push(payload)
    }
  },
  hideTab(state, payload: File) {
    state.workspaces[state.activeWorkspaceIndex].openFiles = state.workspaces[
      state.activeWorkspaceIndex
    ].openFiles!.filter((f: File) => f.path !== payload.path)
  }
}

const actions: ActionTree<IdeState, RootState> = {
  addFile(
    { state, rootState, commit, dispatch, getters, rootGetters },
    payload: string
  ) {
    const projectFiles: File[] = getters.projectTree.folders[0].files
    const contractName = payload.endsWith('.sol')
      ? payload
          .split('.')
          .slice(0, -1)
          .join('.')
      : payload
    const file: File = {
      index: projectFiles.length,
      name: payload,
      code: `pragma solidity ^0.4.9;\n\ncontract ${contractName} {\n\n\tfunction ${contractName}() public {}\n}`,
      path: `/Example/${payload}`
    }
    projectFiles.push(file)
    commit('updateFolder', projectFiles)
  },
  removeFile(
    { state, rootState, commit, dispatch, getters, rootGetters },
    payload: string
  ) {
    const projectFiles: File[] = getters.projectTree.folders[0].files
    const tabs: File[] = getters.openFiles!
    const activeFile = getters.activeWorkspace.activeFile
    const targetFile: File | undefined = projectFiles.find(
      (file: File) => file.name === payload
    )

    if (targetFile) {
      if (targetFile.name === activeFile.name) {
        tabs.forEach((tab: File, index: number) => {
          if (tab.name === payload) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              commit('setActiveFile', nextTab)
            }
          }
        })
      }
      commit('hideTab', targetFile)
      const updatedFolder = projectFiles.filter(
        (file: File) => file.name !== payload
      )
      commit('updateFolder', updatedFolder)
    }
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
