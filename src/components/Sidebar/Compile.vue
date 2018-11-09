<template>
    <el-button @click="handleCompile">
        Compile
    </el-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Web3, { compile } from '../../../@titan-suite/core/aion'
import { nodeAddress } from './titanrc'

@Component
export default class Compile extends Vue {
    public mounted(): void {
        console.log('Compile Mounted')
    }
    public async handleCompile() {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(nodeAddress))
            console.log({ web3 })
            const contracts = await compile({
                contract: `pragma solidity ^0.4.9;


contract Example {

    uint128 public num = 5;
    event NumChanged (uint128);

    function add(uint128 a) public returns (uint128) {
        return num+a;
    }

    function setA(uint128 a) public {
        num = a;
        NumChanged(num);
    }
}`,
                web3
            })
            console.log({ data: JSON.stringify(contracts) })
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
</script>
