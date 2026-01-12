<template>
    <div class="mansel-vck-vstup-container">
      <div class="mansel-vck-vstup-popis  mansel-vck-vstupy-text--text">
        {{ vstupdata.TEXT }}
      </div>

        <div class="mansel-vck-vstup-hodnota">
          <div class="mansel-vck-vstup-right-auto">
            <div class="pa-0">
                  <v-checkbox
                    v-model="valueChecked"
                    :value="vstupdata.HODNOTA"
                    dense
                    pa-0
                    @change="changeValue"
                  ></v-checkbox>
              </div>
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
      valueChecked: false,      
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
  mounted: function() {

  }, 
  methods: {
    changeValue(newValue) {

      this.valueChecked = newValue;
      this.$emit("ValueChanged", this.valueChecked, this.unitSelected, this.vstupdata);
    },

    updateData(newData) {
      this.valueChecked = newData.HODNOTA;
    },
  },
};
</script>
