<template>
  <div style="margin-bottom:20px">
    <el-row :gutter="11">
      <el-col
        :span="7"
        :offset="1"
      >
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
            class="bloackChainOptions"
          />
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="11">
      <el-col
        :span="7"
        :offset="1"
      >
        <p>Provider</p>
      </el-col>
      <el-col :span="requireNodeAddress?15: 13">
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
            class="providersOption"
          />
        </el-select>
      </el-col>
      <el-col
        v-if="!requireNodeAddress"
        :span="2"
      >
        <el-button
          :id="id+'SetProvider'"
          :type="isProviderSet ? 'success' : 'info'"
          size="mini"
          icon="el-icon-check"
          circle
          style="margin-top:0.69rem"
          @click="handleInstantiateProvider"
        />
      </el-col>
    </el-row>

    <el-row
      v-if="requireNodeAddress"
      :gutter="11"
    >
      <el-col
        :span="7"
        :offset="1"
      >
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
          @click="handleInstantiateProvider"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Mutation, State, Action } from 'vuex-class'
import { MessageBox } from 'element-ui'

const namespace = 'run'
@Component
export default class NodeAddressInput extends Vue {
  @Prop(String) public id!: string
  @State('selectedBlockchain', { namespace }) public selectedBlockchain!: string
  @State('selectedProvider', { namespace }) public selectedProvider!: string
  @State('providerAddress', { namespace }) public providerAddress!: string
  @State('isProviderSet', { namespace }) public isProviderSet!: boolean
  @State('blockchains', { namespace }) public blockchains!: { [key: string]: any }
  @State('providers', { namespace }) public providers!: { [key: string]: any }

  @Mutation('setBlockchain', { namespace }) public setBlockchain!: (blockchain: string) => void
  @Mutation('setCompilerType', { namespace: 'compile' }) public setCompilerType!: (type: string) => void
  @Mutation('setProvider', { namespace }) public setProvider!: (provider: string) => void
  @Mutation('setProviderAddress', { namespace }) public setProviderAddress!: (providerAddress: string) => void

  @Action('instantiateProvider', { namespace }) public instantiateProvider!: () => void

  public get requireNodeAddress(): boolean {
    return this.selectedProvider === this.providers.Web3Provider
  }

  public set selectedBlockchainModel(value: string) {
    this.setBlockchain(value)
    this.setCompilerType(value)
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
  public async handleInstantiateProvider() {
    try {
      await this.instantiateProvider()
    } catch (e) {
      const h = this.$createElement
      const message = `${e.message}`.split(';')
      await MessageBox.alert('Warning', {
        message: h('div', undefined, [
          h('p', undefined, message[0]),
          h(
            'button',
            {
              attrs: {
                id: 'getLink',
                type: 'button',
                class: 'el-button el-button--text',
                onclick: `window.open("${message[1]}")`,
              },
            },
            message[1]
          ),
        ]),
        center: true,
        title: 'Warning',
        type: 'warning',
        cancelButtonClass: 'secondaryButton',
        confirmButtonText: 'OK',
      })
      console.error(e)
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>