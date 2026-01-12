<template>
  <v-app>
    <v-app-bar
      app
      color="primary"      
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        text
        @click="changeProduct"
        value="I2xf34trEQW21gFMOFDMQ"
      >
        FDMQ
      </v-btn>
      
      <v-btn
        text
        @click="changeProduct"
        value="I2xf34trEQW21gFMOFDML"
      >
        FDML
      </v-btn>

      
      <v-btn
        text
        @click="changeProduct"
        value="FGHD00t14S34SsG00SMR"
      >
      SMR
      </v-btn>


      <v-btn
        text
        @click="changeProduct"
        value="XCVD11t22s32Ss70BSMM"
      >
      SMM
      </v-btn>

            <v-btn
        text
        @click="changeProduct"
        value="JSRZ001YER2025tA00NDM"
      >
      NDM
      </v-btn>



      <v-select class="v-select__vck1"
            :items="items"
            :item-text="'T'"
            :item-value="'H'"
            v-model="selectedItem"
            v-on:change="changeValue"
            solo
            pa-0
            hide-details
            background-color="mansel-vck-seznam-vstupy-bg"       
            ref="vstupValue"
      ></v-select>

    </v-app-bar>
    <v-main>

      <div style="height: 30px;"></div>
      <v-btn
        @click="ulozitKonfiguraci"
      >
        Uložit konfiguraci
      </v-btn>


      <input type="file" ref="fileKomp" style="display: none" @change="onNacistKonfiguraci" />
      <v-btn
        @click="nacistKonfiguraci"
      >
        Načíst konfiguraci
      </v-btn>

      <v-btn
        @click="resetKonfiguraci"
      >
        Reset
      </v-btn>

      <div style="height: 30px;"></div>


      <ManselVCK1 ref="manselKomp" :produkt="produktSel" jazyk="CJ" v-on:reloadDataEvent="reloadDataEvent" v-on:cellDoubleClickedEvent="cellDoubleClicked" sirkaInfoVstupyRedukovana="300" url="https://www.viklan.cz/cadkonfserver-connector-v2.php/produkt-query/" /> <!--   https://www.viklan.cz/cadkonfserver-connector-v2.php/produkt-query/     http://localhost:6010/produkt-query/       https://www.viklan-online-mansel.cloud/produkt-query/         https://www.viklan.cz/cadkonfserver-connector-v2.php/produkt-query/      -->

    </v-main>
  </v-app>
</template>



<script>
import ManselVCK1 from './components/ManselVCK1.vue'


export default {
  /* eslint no-unused-vars: 0 */
  name: 'App',

  components: {
    ManselVCK1
  },

  data: () => ({
    produktSel: "JSRZ001YER2025tA00NDM",
    txbProduct: "JSRZ001YER2025tA00NDM",
    items: [/*{ 'T':'FDMA', 'H':'I2xf34trEQW21gFMOFDMA' },
            { 'T':'FDMA-PM', 'H':'I2xf34trEQW21gFMOFDMA-PM' },
            { 'T':'FDMQ', 'H':'I2xf34trEQW21gFMOFDMQ' },
            { 'T':'FDMQ120', 'H':'I2xf34trEQW21gFMOFDMQ120' },
            { 'T':'FDML', 'H':'I2xf34trEQW21gFMOFDML' },
            { 'T':'FDMB', 'H':'I2xf34trEQW21gFMOFDMB' },
            { 'T':'FDMR', 'H':'I2xf34trEQW21gFMOFDMR' },
            { 'T':'FDMR60', 'H':'I2xf34trEQW21gFMOFDMR60' },
            { 'T':'FDMS', 'H':'I2xf34trEQW21gFMOFDMS' },
            { 'T':'CFDM', 'H':'I2xf34trEQW21gFMOCFDM' },
            { 'T':'SEDS', 'H':'FG0034tAEqsd1G740SEDS' },
            { 'T':'SEDM', 'H':'FG0034tAEqsd1G740SEDM' },
            { 'T':'MSD', 'H':'FG0034tAEqsd1G740MSD' },
            { 'T':'SEDSR', 'H':'FG0034tAEqsd1G740SEDSR' },
            { 'T':'SEDSL', 'H':'FG0034tAEqsd1G740SEDSL' },
            { 'T':'SEDML', 'H':'FG0034tAEqsd1G740SEDML' },
            { 'T':'SEDMD', 'H':'FG0034tAEqsd1G740SEDMD' },*/
            { 'T':'RPMV', 'H':'SA78potGEsGd1F74FRPMV' },
            { 'T':'RPMLV', 'H':'SA78potGEsGd1F74FRPMLV' },
            { 'T':'RPMCV', 'H':'SA78potGEsGd1F74FRPMCV' },
            { 'T':'RPMK', 'H':'SA78potGEsGd1F74FRPMK' },
            { 'T':'RPMCK', 'H':'SA78potGEsGd1F74FRPMCK' },
            { 'T':'RDM', 'H':'SA78potGEsGd1F74FRDM' },
            { 'T':'RDTM', 'H':'SA78potGEsGd1F74FRDTM' },
            { 'T':'RKM', 'H':'SA78potGEsGd1F74FRKM' },
            { 'T':'RKTM', 'H':'SA78potGEsGd1F74FRKTM' },
            { 'T':'RKKM', 'H':'SA78potGEsGd1F74FRKKM' },
            { 'T':'RKKTM', 'H':'SA78potGEsGd1F74FRKKTM' },
            { 'T':'RKALM', 'H':'SA78potGEsGd1F74FRKALM' },
            /*{ 'T':'VVM', 'H':'XCVD11t22s32Ss70BVVM' },
            { 'T':'VVPM', 'H':'XCVD11t22s32Ss70BVVPM' },
            { 'T':'VVPME', 'H':'XCVD11t22s32Ss70BVVPME' },
            { 'T':'ALCM', 'H':'XCVD11t22s32Ss70BALCM' },
            { 'T':'ALKM', 'H':'XCVD11t22s32Ss70BALKM' },
            { 'T':'VASM', 'H':'XCVD11t22s32Ss70BVASM' },
            { 'T':'VAPM', 'H':'XCVD11t22s32Ss70BVAPM' },
            { 'T':'VAPML', 'H':'XCVD11t22s32Ss70BVAPML' },
            { 'T':'VVDM', 'H':'XCVD11t22s32Ss70BVVDM' },
            { 'T':'DVCM', 'H':'XCVD11t22s32Ss70BDVCM' },
            { 'T':'RAG45', 'H':'XCVD11t22s32Ss70BRAG45' },
            { 'T':'SMM', 'H':'XCVD11t22s32Ss70BSMM' },
            { 'T':'SMPM', 'H':'XCVD11t22s32Ss70BSMPM' },
            { 'T':'VNM', 'H':'XCVD11t22s32Ss70BVNM' },
            { 'T':'VNKM', 'H':'XCVD11t22s32Ss70BVNKM' },
            { 'T':'KMM', 'H':'XCVD11t22s32Ss70BKMM' },
            { 'T':'SDL', 'H':'XCVD11t22s32Ss70BSDL' },
            { 'T':'DDM2', 'H':'XCVD11t22s32Ss70BDDM2' },
            { 'T':'TVXM', 'H':'XCVD11t22s32Ss70BTVXM' },
            { 'T':'DDME', 'H':'XCVD11t22s32Ss70BDDME' },
            { 'T':'HEPABOX', 'H':'XCVD11t22s32Ss70BHEPABOX' },
            { 'T':'PDZM', 'H':'XCVD11t22s32Ss70BPDZM' },
            { 'T':'VPVM', 'H':'XCVD11t22s32Ss70BVPVM' },
            { 'T':'VSV', 'H':'XCVD11t22s32Ss70BVSV' },
            { 'T':'SMR', 'H':'FGHD00t14S34SsG00SMR' },
            { 'T':'NDM', 'H':'JSRZ001YER2025tA00NDM' }*/
            ],
    selectedItem: null,
    value: null,
  }),
  methods: {
    changeValue(val) {
      this.produktSel = val;
    },

    changeProduct(event)
    {
        event.preventDefault();
        this.produktSel = event.target.value;
    },

    reloadDataEvent(vystupniParametry)
    {console.log(" CLICK");
        console.log(vystupniParametry);
    },

    cellDoubleClicked(vystupniParametry)
    { 
        console.log("DOUBLE CLICK");
        console.log(vystupniParametry);
    },

    ulozitKonfiguraci(event)
    {
      event.preventDefault();
      this.$refs.manselKomp.saveDataToString().then((konfData) => {
          if (konfData.res == "ok") {
              const data = konfData.data;
              const blob = new Blob([data], {type: 'text/plain'});
              const e = document.createEvent('MouseEvents'),
              a = document.createElement('a');
              a.download = "test.json";
              a.href = window.URL.createObjectURL(blob);
              a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
              e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
              a.dispatchEvent(e);
            }
            else
            {
                console.log(konfData.msg);
            }
        })
        .catch((e) => {
          console.log(e);
        });
    },


    resetKonfiguraci(event) {
      event.preventDefault();
      this.$refs.manselKomp.resetVstupy();
    },

    nacistKonfiguraci()
    {
      this.$refs.fileKomp.click();
    },

    onNacistKonfiguraci (event) {
      const files = event.target.files;
      const fileReader = new FileReader();
      const vueObj = this.$refs;
      fileReader.onload = function(event)
        {
            const data = JSON.parse(event.target.result);
            vueObj.manselKomp.loadDataFromString(data);
        };
      fileReader.readAsText(files[0]);
      
    } 
  }
};
</script>


<style>
button span {
  pointer-events: none;
  text-transform: none;
}

</style>
