<template>
  <div style="margin-bottom:20px">
    <el-row :gutter="11">
      <el-col :span="7" :offset="1">
        <p>Blockchain</p>
      </el-col>
      <el-col :span="15">
        <el-select
          :id="id+'SelectBlockchain'"
          v-model="selectedBlockchainModel"
          class="select"
          style="display: block"
        >
          <el-option
            v-for="[key, value] in Object.entries(blockchains)"
            :key="key"
            :label="value"
            :value="value"
          />
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="11">
      <el-col :span="7" :offset="1">
        <p>Provider</p>
      </el-col>
      <el-col :span="13">
        <el-select
          :id="id+'SelectProvider'"
          v-model="selectedProviderModel"
          class="select"
          style="display: block"
        >
          <el-option
            v-for="[key, value] in Object.entries(providers)"
            :key="key"
            :label="value"
            :value="value"
          />
        </el-select>
      </el-col>
      <el-col v-if="!requireNodeAddress" :span="2">
        <el-button
          :id="id+'SetProvider'"
          :type="isProviderSet ? 'success' : 'info'"
          size="mini"
          icon="el-icon-check"
          circle
          style="margin-top:0.69rem"
          @click="instantiateProvider"
        />
      </el-col>
      <el-col v-else :span="2">
        <el-button
          :id="id+'importPK'"
          :type="isPrivateKeySet ? 'success' : 'primary'"
          size="mini"
          icon="el-icon-download"
          circle
          style="margin-top:0.69rem"
          @click="showImportDialog = true"
        />
      </el-col>
    </el-row>

    <el-row v-if="requireNodeAddress" :gutter="11">
      <el-col :span="7" :offset="1">
        <p>Provider Address</p>
      </el-col>
      <el-col :span="13">
        <el-input
          :id="id+'ProviderAddressInput'"
          v-model="providerAddressModel"
          :value="providerAddress"
          clearable
        />
      </el-col>
      <el-col :span="2">
        <el-button
          :id="id+'SetProvider'"
          :type="isProviderSet ? 'success' : 'info'"
          size="mini"
          icon="el-icon-check"
          circle
          style="margin-top:0.69rem"
          @click="instantiateProvider"
        />
      </el-col>
    </el-row>
    <el-dialog :visible.sync="showImportDialog" title="Import Private Key" width="30%">
      <el-row :gutter="11">
        <el-col :span="7" :offset="1">
          <p>Address</p>
        </el-col>
        <el-col :span="15">
          <el-input id="privateKeyAddress" v-model="privateKeyAddressModel" clearable/>
        </el-col>
      </el-row>
      <el-row :gutter="11">
        <el-col :span="7" :offset="1">
          <p>Private Key</p>
        </el-col>
        <el-col :span="15">
          <el-input id="privateKeyInput" v-model="privateKeyModel" type="password" clearable/>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="secondaryButton" @click="showImportDialog = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="setPrivateKey({key:privateKeyModel, address:privateKeyAddressModel});showImportDialog = false;privateKeyModel=''"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Mutation, State, Action } from 'vuex-class'
const namespace = 'run'
@Component
export default class NodeAddressInput extends Vue {
  @Prop(String) public id!: string
  @State('selectedBlockchain', { namespace }) public selectedBlockchain!: string
  @State('selectedProvider', { namespace }) public selectedProvider!: string
  @State('providerAddress', { namespace }) public providerAddress!: string
  @State('isPrivateKeySet', { namespace }) public isPrivateKeySet!: boolean
  @State('isProviderSet', { namespace }) public isProviderSet!: boolean
  @State('blockchains', { namespace }) public blockchains!: { [key: string]: any }
  @State('providers', { namespace }) public providers!: { [key: string]: any }

  @Mutation('setBlockchain', { namespace }) public setBlockchain!: (blockchain: string) => void
  @Mutation('setProvider', { namespace }) public setProvider!: (provider: string) => void
  @Mutation('setProviderAddress', { namespace }) public setProviderAddress!: (providerAddress: string) => void
  @Mutation('setPrivateKey', { namespace }) public setPrivateKey!: (key: string) => void

  @Action('instantiateProvider', { namespace }) public instantiateProvider!: () => void

  public showImportDialog: boolean = false
  public privateKeyAddressModel: string = ''
  public privateKeyModel: string = ''
  public get requireNodeAddress(): boolean {
    return this.selectedProvider === this.providers.Web3Provider
  }

  public set selectedBlockchainModel(value: string) {
    this.setBlockchain(value)
  }
  public get selectedBlockchainModel(): string {
    return this.selectedBlockchain
  }
  public set selectedProviderModel(value: string) {
    this.setProvider(value)
  }
  public get selectedProviderModel(): string {
    return this.selectedProvider
  }
  public set providerAddressModel(value: string) {
    this.setProviderAddress(value)
  }
  public get providerAddressModel(): string {
    return this.providerAddress
  }
}
</script>

<style lang="stylus" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>