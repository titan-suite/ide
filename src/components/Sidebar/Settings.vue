<template>
  <p> Settings</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Settings extends Vue {
    public mounted(): void {
        console.log('Settings Mounted')
    }
}
</script>
