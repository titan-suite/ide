<template>
  <p> Console</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Console extends Vue {
    public mounted(): void {
        console.log('Console Mounted')
    }
}
</script>
