<template>
    <div class="mansel-vck-vstup-container">
      <div class="mansel-vck-vstup-popis">
        {{ vstupdata.TEXT }}
      </div>

      <div class="mansel-vck-vstup-hodnota">
          <!--<div class="vstup-units" v-if="unitsEnabled">

          </div>-->
          <div class="mansel-vck-vstup-right pa-0">

                  <v-text-field :background-color="value"
                  dense
                  disabled
                  pa-0
                  hide-details
                ></v-text-field>

          </div>
        </div>
      </div>
</template>

<script>
export default {
  props: {
    vstupdata: Object,
  },
  data() {
    return {

      value: null,
    };
  },
  watch: {
    vstupdata: function (newData) {
      if (newData) this.updateData(newData);
    },
  },
  created: function () {
    if (this.vstupdata) this.updateData(this.vstupdata);
  },
  methods: {
    changeValue(event) {
      event.preventDefault();
      this.$emit("ValueChanged", event.value, this.unitSelected, this.vstupdata);
    },

    changeValueUnit(val) {
      this.$emit('ValueChanged', val, this.unitSelected, this.vstupdata);
    },

    updateData(newData) {
      this.value = "rgb(" + newData.HODNOTA + ")";

    },
  },
};
</script>
