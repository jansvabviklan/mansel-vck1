<template>
    <div class="mansel-vck-vstup-container">
      <div class="mansel-vck-vstup-popis mansel-vck-vstupy-text--text">
        {{ vstupdata.TEXT }}
      </div>
      <div class="mansel-vck-vstup-hodnota">
        <div class="mansel-vck-vstup-units" v-if="unitsEnabled">
          <v-select
            :items="units"
            :item-text="'T'"
            :item-value="'J'"
            v-model="unitSelected"
            v-on:change="changeValue"
            dense
            pa-0
            hide-details
            background-color="mansel-vck-jednotky-bg"
            ref="vstupUnits"
          >
          </v-select>
        </div>
        <div class="mansel-vck-vstup-units-readonly mansel-vck-vstupy-text--text" v-show="unitsReadonly" ref="vstupUnitsReadonly">
          [{{ unitSelected }}]
        </div>
        <div class="mansel-vck-vstup-right">
          <v-select class="v-select__vck1"
            :items="items"
            :item-text="'T'"
            :item-value="'H'"
            v-model="selectedItem"
            v-on:change="changeValue"
            dense
            pa-0
            hide-details
            background-color="mansel-vck-seznam-vstupy-bg"       
            ref="vstupValue"
          ></v-select>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    vstupdata: Object,
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
      if (this.$vuetify.theme.currentTheme["mansel-vck-seznam-vstupy-text"])
      {
          const inputControl = this.$refs.vstupValue.$el.getElementsByClassName("v-select__selection")[0];          
          if (inputControl) 
          {
            inputControl.classList.add("mansel-vck-seznam-vstupy-text--text");
          }
      }

      if (this.$refs.vstupUnits)
      {
        const inputControl = this.$refs.vstupUnits.$el.getElementsByClassName("v-select__selection")[0];   

        if (inputControl)
        {
          if (this.$vuetify.theme.currentTheme["mansel-vck-jednotky-text"]) inputControl.classList.add("mansel-vck-jednotky-text--text");
          else inputControl.classList.add("mansel-vck-jednotky-text");     
        }           
      }

      if (this.$refs.vstupUnitsReadonly)
      {
        const inputControl = this.$refs.vstupUnitsReadonly;   

        if (inputControl)
        {
          if (this.$vuetify.theme.currentTheme["mansel-vck-vstupy-text"]) inputControl.classList.add("mansel-vck-vstupy-text--text");
          else inputControl.classList.add("mansel-vck-vstupy-text");        
        }       
      }
  }, 
  data: () => ({
    items: [],
    selectedItem: null,
    unitsEnabled: false,
    unitsReadonly: false,
    units: [],
    unitSelected: null,
    value: null,
  }),
  methods: {
    changeValue(val) {
      this.$emit("ValueChanged", val, this.unitSelected, this.vstupdata);
    },

    updateData(newData) {
      this.items = newData.VOLBY;
      this.selectedItem = newData.HODNOTA;

      if ("" + newData.JEDN == "") {
        this.unitsEnabled = false;
        this.units = [];
        this.unitSelected = null;
        this.unitsReadonly = false;

        if (newData.JEDNSEL != "")
        {
          this.unitSelected = newData.JEDNSEL;
          this.unitsReadonly = true;
        }
      } else {
        this.unitsReadonly = false;
        this.unitsEnabled = true;
        this.units = newData.JEDNSEZNAM;
        this.unitSelected = newData.JEDNSEL;
      }
    },
  },
};
</script>


<style lang="scss">
  .v-select__selection--comma {
    white-space: unset;
  }



</style>