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
            {{ unitSelectedStr }}
          </div>
          <div class="mansel-vck-vstup-right">
            <v-container class="pa-0">
              <v-row align="center">
                <!--centrovani vertikalni-->
                <v-col cols="4" class="vstup-mminput-meze mansel-vck-mminput-vstupy-meze-text--text">
                  {{ vstupdata.MINPOPIS }} :
                  {{ minHodnotaStr }}
                </v-col>

                <v-col cols="4">
                  <v-text-field
                    v-model="value"
                    type="number"
                    dense
                    pa-0
                    hide-details
                    hide-spin-buttons
                    @keydown.enter="changeValue"
                    @blur="changeValue"
                    background-color="mansel-vck-mminput-vstupy-bg"
                    ref="vstupValue"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="vstup-mminput-meze mansel-vck-mminput-vstupy-meze-text--text">
                  {{ vstupdata.MAXPOPIS }} :
                  {{ maxHodnotaStr }}
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
      </div>
</template>

<script>
export default {
  setup() {},
  data() {
    return {
      unitsEnabled: false,
      unitsReadonly: false,
      units: [],
      unitSelected: null,
      unitSelectedStr: "",
      minHodnotaStr: "",
      maxHodnotaStr: "",
      value: null    
    };
  },
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
      if (this.$vuetify.theme.currentTheme["mansel-vck-mminput-vstupy-text"])
      {
          const inputControl = this.$refs.vstupValue.$el.getElementsByTagName("input")[0];          
          if (inputControl) 
          {
            inputControl.classList.add("mansel-vck-mminput-vstupy-text--text");
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
  methods: {
    changeValueUnit(val) {
      this.$emit('ValueChanged', this.value, val, this.vstupdata);
    },

    changeValue(event) {
      event.preventDefault();

      var min = this.vstupdata.MIN;
			var max = this.vstupdata.MAX;
			var krok = this.vstupdata.KROK;
					
			var hodnText = this.value.replace(",", ".");
			var hodn = parseFloat(hodnText);

			if (this.vstupdata.HODNOTA == this.value) return;

			if (krok > 0)
			{
				var pocetDesMist = this.vstupdata.POCETDESMIST;
				hodn = hodn.toFixed(pocetDesMist);
				
				var zbytek = hodn % krok;
				if (zbytek != 0)
				{
					hodn = Math.floor(hodn / krok) * krok;
				}
			}
			
			if (hodn < parseFloat(min)) hodn = min;
			else if (hodn > parseFloat(max)) hodn = max;
			
			this.value = hodn;

      this.$emit("ValueChanged", this.value,this.unitSelected, this.vstupdata);
    },

    updateData(newData) {
      this.value = newData.HODNOTA;

      if ("" + newData.JEDN == "") {
        this.unitsEnabled = false;
        this.units = [];
        this.unitSelected = null;
        this.unitSelectedStr = "";
        this.unitsReadonly = false;

        if (newData.JEDNSEL != "")
        {
          this.unitSelected = newData.JEDNSEL;
          this.unitSelectedStr = "[" + newData.JEDNSEL + "]";
          this.unitsReadonly = true;
        }
      } else {
        this.unitsReadonly = false;
        this.unitsEnabled = true;        
        this.units = newData.JEDNSEZNAM;
        this.unitSelected = newData.JEDNSEL;
        this.unitSelectedStr = "[" + newData.JEDNSEL + "]";
      }

      if (newData.ZPUSOB_ZOBRAZENI_JEDNOTKY == "1") //nezobrazovat jednotku 
      {
        this.unitsReadonly = true; //kvuli placeholderu jednotek
        this.unitSelectedStr = "";  
        this.unitsEnabled = false;        
      }

      this.minHodnotaStr = newData.MIN;
      this.maxHodnotaStr = newData.MAX;
      if ((newData.ZPUSOB_ZOBRAZENI_JEDNOTKY == 1 || newData.ZPUSOB_ZOBRAZENI_JEDNOTKY == 2) && newData.JEDNSEL != "")
      {
        this.minHodnotaStr = newData.MIN + " " + newData.JEDNSEL;
        this.maxHodnotaStr = newData.MAX + " " + newData.JEDNSEL;
      }
    },
  },
};
</script>

<style scoped>

.vstup-mminput-meze {
  font-size: 0.9em;
  text-align: center;
}
</style>
