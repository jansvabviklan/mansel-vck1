<template>
    <div class="mansel-vck-vstup-container vstup-container-info">
      <div class="mansel-vck-vstup-popis mansel-vck-vstupy-text--text">
        {{ vstupdata.TEXT }}
      </div>
      <div class="mansel-vck-vstup-hodnota">
        <div class="mansel-vck-vstup-units" v-show="unitsEnabled">
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
            class="mansel-vck-jednotky-text"
            ref="vstupUnits"
          >
          </v-select>
        </div>
        <div class="mansel-vck-vstup-units-readonly mansel-vck-vstupy-text--text" v-show="unitsReadonly" ref="vstupUnitsReadonly">
          [{{ unitSelected }}]
        </div>
        <div class="mansel-vck-vstup-right">
          <div class="pa-0">            
              <!--centrovani vertikalni-->

                <v-text-field
                  :value="vstupdata.HODNOTA"
                  dense
                  readonly
                  pa-0
                  hide-details
                  background-color="mansel-vck-info-vstupy-bg"
                  class="tf-info-vstup mansel-vck-info-vstupy--text"
                  ref="vstupValue"
                ></v-text-field>
          </div>
        </div>
      </div>
      <div class="mansel-vck-vstup-popis-info-right mansel-vck-vstupy-text--text" v-show="popisVpravoEnabled">
          <div class="mansel-vck-vstup-popis-info-right-text">{{ vstupdata.POPISVPRAVO }}</div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    vstupdata: Object,
    sirkaInfoVstupyRedukovana: String
  },
  data() {
    return {
      unitsEnabled: false,
      unitsReadonly: false,      
      units: [],
      unitSelected: null,
      value: null,

      popisVpravoEnabled: false

    }
  },
  watch: {
    vstupdata: function (newData) {
      if (newData) this.updateData(newData);
      this.updateCss(newData);
    },
  },
  created: function () {
    if (this.vstupdata) this.updateData(this.vstupdata);
  },

  mounted: function() {
    this.$nextTick(() => {
        this.updateCss(this.vstupdata);
      });

      const inputControl = this.$refs.vstupValue.$el.getElementsByTagName("input")[0];    
      if (inputControl) 
      {
        if (this.$vuetify.theme.currentTheme["mansel-vck-info-vstupy-text"]) inputControl.classList.add("mansel-vck-info-vstupy-text--text");
        else inputControl.classList.add("mansel-vck-info-vstupy-text");
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
    changeValue(val) {
      this.$emit('ValueChanged', val, this.unitSelected, this.vstupdata);
    },

    
    updateCss(newData)
    {
      const cssVstupUnits = window.getComputedStyle(document.querySelector('.mansel-vck-vstup-units'));

      var wUnits = 0;
      if ("" + newData.JEDN != "")
      {
        const unitDiv = this.$el.getElementsByClassName("mansel-vck-vstup-units");
        if (unitDiv.length > 0) wUnits = unitDiv[0].offsetWidth;
      }

      var sirkaInfoRed = 300;
      if (this.sirkaInfoVstupyRedukovana > 0) sirkaInfoRed = this.sirkaInfoVstupyRedukovana;
        this.$el.querySelectorAll(".mansel-vck-vstup-right").forEach((vstup) => {

          vstup.getElementsByTagName('input').forEach((inputVstup) => {
            if (inputVstup.type == "text")
            {
                const wCast = sirkaInfoRed - wUnits;
                var wText = this.vklGetWidthOfText("" + inputVstup.value, cssVstupUnits.fontFamily, cssVstupUnits.fontsize, cssVstupUnits.fontweight) + 25;

                if (wText < wCast)
                {
                  this.$el.querySelector(".mansel-vck-vstup-hodnota").style.maxWidth = sirkaInfoRed +"px";
                  this.$el.querySelector(".mansel-vck-vstup-right").style.minWidth = "100px";                  
                }
            }
          }, this);
        });
    },

    updateData(newData) {
        this.value = newData.HODNOTA;
        this.popisVpravoEnabled = ("" + newData.POPISVPRAVO != "");


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
    vklGetWidthOfText(txt, fontname, fontsize, fontweight)
    {
      const canvas = document.getElementsByClassName("canvasVCKTextWidth")[0];
      const ctx = canvas.getContext("2d");
      ctx.font = fontweight + ' ' + fontsize + ' ' + fontname;

      let text = ctx.measureText(txt);
      return text.width;
    }
  }
};
</script>

