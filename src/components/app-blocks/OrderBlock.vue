<template lang="pug">
v-card
  DefaultSnackbar
  v-slide-x-transition
    template(v-if='state === "filling"')
      v-card.fields__addresses(flat)
        .fields__addresses-wrap
          v-card.fields__addresses-inputs.elevation-6
            ClientField
            AddressField(:disabled='!client')
          ClientFavorites
          PickAddresses
          ChangeAddressesOrder(v-if='addressList')
          template(v-if='priceList')
            v-btn(color='primary', block, @click='toSendOrder()', v-if='priceList.overall') Вызвать экспедитора
          v-spacer
  v-slide-x-transition
    template(v-if='state === "completing"')
      SendOrder(@back='fromSendOrder()', @order-sended='orderSended', @order-sended-error='orderSendedError')
</template>

<script>
import { mapState, mapActions } from 'vuex'

import DefaultSnackbar from '@/components/snackbars/DefaultSnackbar'

import ChangeAddressesOrder from '@/components/form-blocks/ChangeAddressesOrder'

import PickAddresses from '@/components/form-blocks/PickAddresses'

import ClientFavorites from '@/components/ClientFavorites'
import AddressField from '@/components/AddressField'
import ClientField from '@/components/ClientField'
import SendOrder from '@/components/SendOrder'

export default {
  name: 'OrderBlock',

  components: {
    ChangeAddressesOrder,
    DefaultSnackbar,
    AddressField,
    ClientField,
    PickAddresses,
    ClientFavorites,
    SendOrder,
  },

  props: ['state'],

  data: () => ({
    msg: false,
    msgColor: 'success',
    msgText: '',
  }),

  computed: {
    ...mapState(['priceList', 'client', 'addressList']),
    isRememberedUser() {
      if (localStorage.getItem('rememberedUserID')) {
        const userId = parseInt(localStorage.getItem('rememberedUserID'))
        if (!isNaN(userId)) {
          return userId
        }
      }
      return false
    },
  },

  methods: {
    ...mapActions(['GET_CLIENT', 'RESET_FORM']),
    toSendOrder() {
      this.$emit('state-change', 'completing')
    },
    fromSendOrder() {
      this.$emit('state-change', 'filling')
    },
    async orderSended(info) {
      this.state = 'filling'
      this.msg = true
      this.msgColor = 'success'
      this.msgText = `Заявка ${info.id} успешно передана в работу.`

      this.RESET_FORM
      await this.GET_CLIENT(info.client)
    },
    async orderSendedError() {
      this.msg = true
      this.msgColor = 'error'
      this.msgText = 'Не удалось передать заявку в работу. Попробуйте снова, или свяжитесь с администрацией сайта.'

      this.RESET_FORM
      if (this.isRememberedUser) {
        await this.GET_CLIENT(this.isRememberedUser)
      }
    },
  },

  watch: {},

  async mounted() {},
}
</script>

<style lang="stylus"></style>
