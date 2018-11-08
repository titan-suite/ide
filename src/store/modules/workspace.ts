import { MutationTree } from 'vuex'
import { WorkspaceState, File } from '../types'

const defaultFile: File = {
  name: 'TestToken.sol',
  code: `pragma solidity ^0.4.9;
/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * See https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  function totalSupply() public returns (uint128);
  function balanceOf(address who) public returns (uint128);
  function transfer(address to, uint128 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint128 value);
}

contract TestToken is ERC20Basic {

  mapping(address => uint128) balances;

  uint128 public totalSupply_ = 10000000;
  uint128 public decimals = 18;

  function TestToken() public {
      balances[msg.sender] = totalSupply_ * 10**decimals;
  }

  /**
  * @dev Total number of tokens in existence
  */
  function totalSupply() public returns (uint128) {
    return totalSupply_;
  }

  /**
  * @dev Transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint128 _value) public returns (bool) {
    if (_to == address(0)) throw;
    if (_to == msg.sender) throw;
    if (_value > balances[msg.sender]) throw;
    if (balances[_to] + _value < balances[_to]) throw;

    balances[msg.sender] = balances[msg.sender] - _value;
    balances[_to] = balances[_to] + _value;
    Transfer(msg.sender, _to, _value);
    return true;
  } 

  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint128 the amount of tokens to be transferred
   */
  function transferFrom(address _from, address _to, uint128 _value) public returns (bool) {
    if (_to == address(0)) throw;
    if (_value > balances[_from]) throw;
    if (balances[_to] + _value < balances[_to]) throw;
 
    balances[_from] = balances[_from] - _value;
    balances[_to] = balances[_to] + _value;
    Transfer(_from, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return A uint128 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public returns (uint128) {
    return balances[_owner];
  }

`,
  path: '/'
}

const workspaceState: WorkspaceState = {
  name: '',
  folders: [],
  activeFile: defaultFile,
  openFileNames: [],
  editorOptions: {
    tabSize: 4,
    mode: 'text/javascript',
    theme: 'monokai',
    lineNumbers: true,
    line: true,
    gutters: ['CodeMirror-linenumbers', 'breakpoints']
  }
}

const mutations: MutationTree<WorkspaceState> = {
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
  setActiveFileContent(state, payload: string) {
    console.log('in state' + payload)
    state.activeFile.code = payload
  }
}

const workspace = {
  namespaced: true,
  state: workspaceState,
  mutations
}

export default workspace
