<template>
    <div class="mansel-vck-vstup-container">
      <div class="mansel-vck-vstup-popis  mansel-vck-vstupy-text--text">
        {{ vstupdata.TEXT }}
      </div>

        <div class="mansel-vck-vstup-hodnota">
          <div class="mansel-vck-vstup-units" v-if="unitsEnabled">
            <v-select
              :items="units"
              :item-text="'T'"
              :item-value="'J'"
              v-model="unitSelected"
              v-on:change="changeValueUnit"
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
            <div class="pa-0">
                  <v-text-field
                    v-model="value"
                    dense
                    pa-0
                    hide-details
                    hide-spin-buttons
                    @keydown.enter="changeValue"
                    @blur="changeValue"
                    background-color="mansel-vck-input-vstupy-bg"
                  ></v-text-field>
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
      unitsEnabled: false,
      unitsReadonly: false,
      units: [],
      unitSelected: null,
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
  mounted: function() {
    if (this.$vuetify.theme.currentTheme["mansel-vck-input-vstupy-text"])
    {
        const divInput = this.$el.getElementsByClassName("v-text-field__slot")[0];
        if (divInput) divInput.getElementsByTagName("input")[0].classList.add("mansel-vck-input-vstupy-text--text");
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
  methods: {
    changeValue(event) {
      event.preventDefault();
      if (this.vstupdata.HODNOTA == event.target.value) return;
				
			this.value = event.target.value;
      
      this.$emit("ValueChanged", event.target.value, this.unitSelected, this.vstupdata);
    },

    changeValueUnit(val) {
      this.$emit('ValueChanged', val, this.unitSelected, this.vstupdata);
    },

    updateData(newData) {
      this.value = newData.HODNOTA;

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
