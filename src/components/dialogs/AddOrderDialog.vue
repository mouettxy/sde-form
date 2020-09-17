<template lang="pug">
.add-alias-dialog
  v-dialog(v-model='value', max-width='50%', :fullscreen='isMobile', transition='dialog-bottom-transition')
    v-card
      v-card-title
        span {{ $t("orderField.header") }}
        v-spacer
        v-btn(icon, @click='value = false')
          v-icon mdi-close
      v-card-text
        h4.text-error {{$t("orderField.disclaimer")}}
        v-form(@submit.prevent='saveOrder')
          v-text-field(
            v-model='orderName',
            :color='color',
            :label='$t("orderField.label")',
            :hint='$t("orderField.hint")',
            auocomplete='chrome-off',
            prepend-inner-icon='mdi-content-save'
          )
          v-btn(@click='saveOrder', color='primary') {{$t("orderField.btn")}}
  slot(name='button', :open='openDialog')
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'

import { breakpoints, colors } from '@/mixins'

@Component
export default class AddAddressDialog extends Mixins(breakpoints, colors) {
  public value = false
  public orderName = ''

  openDialog() {
    this.value = true
  }

  saveOrder() {
    console.log('order-saved')
  }
}
</script>

<style lang="sass"></style>
