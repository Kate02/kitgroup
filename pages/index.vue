<template>
  <div>
    
  <v-card class="py-4 d-flex justify-center ma-6 converter__card">
    <v-row>
      <v-col cols="5"
             xs="12"
      >
        <div class="pa-6">
          <h4 class="text-h5 converter__title">Отдаю</h4>

          <div class="d-flex">
            <v-text-field v-model="textfield.from"
                          type="number"
                          name="calcAmount"
                          class="converter__textfield"
                          @input="calculateTo"
            ></v-text-field>

            <v-select v-model="select.from"
                      :hint="`${select.from.cc}` || ''"
                      :items="currency"
                      item-text="txt"
                      persistent-hint
                      return-object
                      single-line
                      @change="calculateTo"
            ></v-select>
          </div>

          <div class="mt-5 text-right converter__rate">{{rateFrom}}</div>
        </div>
      </v-col>
      <v-col cols="2" 
             class="d-flex justify-center align-center"
             xs="12"
      >
        <v-btn class="mx-2 text-h6 converter__btn-reverse"
               fab
               dark
               large
               color="primary"
               @click="reverseConverter"
        >
          ⇆
        </v-btn>
      </v-col>
      <v-col cols="5"
        xs="12"
      >
        <div class="converter__block pa-6">
          <h4 class="text-h5 converter__title">Получаю</h4>

          <div class="d-flex">
            <v-text-field v-model="textfield.to"
                          class="converter__textfield"
                          type="number"
                          name="calcOutputAmount"
                          @input="calculateFrom"
            ></v-text-field>

            <v-select v-model="select.to"
                      :hint= "`${select.to.cc}` || ''"
                      :items="currency"
                      item-text="txt"
                      persistent-hint
                      return-object
                      single-line
                      @change="calculateFrom"
            ></v-select>            
          </div>

          <div class="mt-5 text-right converter__rate">{{rateTo}}</div>
        </div>
      </v-col>
    </v-row>
  </v-card>
  <v-btn x-large
         color="primary"
         dark
         class="converter__btn-fix ma-6"
         @click="fixConverter"
  >
    Зафиксировать курс
  </v-btn>
  </div>
</template>

<script>
  export default {
    name: 'IndexPage',

    async asyncData( d ) {
      const currency = await d.$axios.$get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')

      return {currency}
    },

    created () {      
      this.select.from = this.currency.find(item => item.cc === 'USD')
      this.select.to = this.currency.find(item => item.cc === 'USD')

      this.textfield.from = `100.00`
      this.textfield.to = `${(this.getRate(this.select.from.rate, this.select.to.rate) * +this.textfield.from).toFixed(2)}`
    },

    data() {
      return {
        select: {
          from: {},
          to: {},
        },

        textfield: {
          from: '',
          to: '',
        },
      }
    },

    computed: {
      rateFrom() {
        return `1 ${this.select.from.cc} = ${this.getRate(this.select.from.rate, this.select.to.rate)} ${this.select.to.cc}`
      },

      rateTo() {
        return `1 ${this.select.to.cc} = ${this.getRate(this.select.to.rate, this.select.from.rate)} ${this.select.from.cc}`
      }
    },

    methods: {
      calculateFrom(value) {
        this.textfield.from = `${(this.getRate(this.select.to.rate, this.select.from.rate) * +this.textfield.to).toFixed(2)}`
      },

      calculateTo(value) {
        this.textfield.to = `${(this.getRate(this.select.from.rate, this.select.to.rate) * +this.textfield.from).toFixed(2)}`
      },

      getRate(value1, value2) {
        return +value1 / +value2
      },

      reverseConverter() {
        this.isReverse = !this.isReverse

        const to = this.textfield.to,
        currencyTo = this.select.to

        this.textfield.to = this.textfield.from
        this.textfield.from = to

        this.select.to = this.select.from
        this.select.from = currencyTo
      },

      fixConverter() {
        this.$store.commit('converter/setFixDate')
        this.$store.commit('converter/setFixRate', this.rateFrom)
      }
    }
  }
</script>
<style lang="scss">

.theme--dark{
  .converter {
    &__card {
      background-color: #51B362;
    }

    &__btn-fix,
    &__btn-reverse {
      color: #FFDD00 !important;
    }

    &__title {
      color: #CDF19D;
    }

    &__rate {
      color: #CDF19D;
    }

    &__textfield {
      font-size: 35px;
    }
  }  
}
</style>
