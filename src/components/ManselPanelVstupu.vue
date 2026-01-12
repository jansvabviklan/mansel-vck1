<template>
  <v-card>
    <div class="mansel-vck-panel-vstupu mansel-vck-panel-text--text" >
      <div v-for="(vstup, index) in vstupy" :key="index">
        <component
          :is="vstup['type']"
          :vstupdata="vstup.vstupdata"
          v-on:ValueChanged="handleValueChanged"         
          :bTabulkaHlucnosti="bTabulkaHlucnosti"
          :sirkaInfoVstupyRedukovana = "sirkaInfoVstupyRedukovana"
        >
        </component>
      </div>
    </div>
  </v-card>
</template>

<script>
import { ref } from "vue";

import ManselInput from "./ManselInput.vue";
import ManselInfo from "./ManselInfo.vue";
import ManselNadpis from "./ManselNadpis.vue";
import ManselMMInput from "./ManselMMInput.vue";
import ManselSeznam from "./ManselSeznam.vue";
import ManselTabulka from "./ManselTabulka.vue";
import ManselBarva from "./ManselBarva.vue";
import ManselCheckbox from "./ManselCheckbox.vue";


export default {
  setup() {
    const count = ref(0);
    return { count };
  },
  data() {
    return {
      vstupy: [
        /*{"vstupdata": {"nadpis": "Info 1", "value": ""}, "type" : "ManselInfo"},
        {"vstupdata": {"nadpis": "Vstup 1", "value": "25"}, "type" : "ManselInput"}*/
      ],
    };
  },
  components: {
    ManselInput,
    ManselInfo,
    ManselNadpis,
    ManselMMInput,
    ManselSeznam,
    ManselTabulka,
    ManselBarva,
    ManselCheckbox
  },
  watch: {
    dataVstupy: 
      function(newVal /*, oldVal*/) {

        if (newVal) {
          var vstupyNew = [];
          newVal.map(function (vs) {
            if (vs.TYP == "DESCR")
              vstupyNew.push({ vstupdata: vs, type: "ManselNadpis" });
            else if (vs.TYP == "INFO")
              vstupyNew.push({ vstupdata: vs, type: "ManselInfo" });
            else if (vs.TYP == "MMINPUT")
              vstupyNew.push({ vstupdata: vs, type: "ManselMMInput" });
            else if (vs.TYP == "INPUT")
              vstupyNew.push({ vstupdata: vs, type: "ManselInput" });
            else if (vs.TYP == "SEZNAM")
              vstupyNew.push({ vstupdata: vs, type: "ManselSeznam" });
            else if (vs.TYP == "TABULKA")
              vstupyNew.push({ vstupdata: vs, type: "ManselTabulka" });
            else if (vs.TYP == "INFOBARVA")
              vstupyNew.push({ vstupdata: vs, type: "ManselBarva" });
            else if (vs.TYP == "CHECKBOX")
              vstupyNew.push({ vstupdata: vs, type: "ManselCheckbox" });
          });

          this.vstupy = vstupyNew;
        } 
        else this.vstupy = [];
      
    },
  },

  props: {
    header: String,
    dataVstupy: Array,
    bTabulkaHlucnosti: Boolean,
    sirkaInfoVstupyRedukovana: String
  },



  methods: {
    handleValueChanged: function (value, jednotka, vstup, doubleClickOrigin) {
      
      this.$emit("ValueChanged", value, jednotka, vstup, doubleClickOrigin);
    },
    
  },
};
</script>



<style lang="scss">
.mansel-vck-panel-vstupu {
  border: 5px solid white;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
  margin-top: 5px;
  padding: 5px;
  /*background-color: rgb(205, 236, 247);*/
}
</style>
