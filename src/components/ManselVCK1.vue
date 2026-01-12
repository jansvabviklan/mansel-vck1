<template>
  <div class="ManselVCK1">
    <div class="vck1" v-bind:class="fullscreenClass">
      <!--<div class="mansel-vck-pnlPrazdny">
        Probíhá inicializace komponenty Mansel...<br /><br />
      </div>-->
      <div>
        <div class="mansel-vck-header" v-show="bHeaderShow">
          <div class="mansel-vck-header-container mansel-vck-header-bg" ref="nadpis">
            <div class="mansel-vck-header-left">
              {{ nadpis }}
            </div>
            <v-spacer></v-spacer>
            <v-btn class="mansel-vck-btn-rezim-zobrazeni mansel-vck-button-bg" v-bind:class="btnRezimZobrazeniClass"  @click="rezimObrazovka"></v-btn>
          </div>
        </div>

        <div class="mansel-vck-pnlHorni">
          <div class="mansel-vck-pnlHorniLevy"
          >
            <div class="mansel-vck-pnlHorniLevyChyba  panel-bg panel-text--text" v-show="bChyba || bInit">
              {{ chyba }}
              <br />
              <v-btn @click="reloadComponentClick" dark v-show="bChyba"> Reload </v-btn>              
            </div>
            <ManselPanelVstupu
              :dataVstupy="dataVstupy"
              v-on:ValueChanged="handleValueChanged"
              :sirkaInfoVstupyRedukovana="sirkaInfoVstupyRedukovana"
            />

            <ManselPanelVstupu
              :dataVstupy="dataVystupy"
              v-on:ValueChanged="handleValueChanged"
              :sirkaInfoVstupyRedukovana="sirkaInfoVstupyRedukovana"
            />

            <ManselPanelVstupu
              :dataVstupy="dataHlucnost"
              v-on:ValueChanged="handleValueChanged"
              v-bind:bTabulkaHlucnosti="true"
              v-show="dataHlucnost ? true : false"
            />

            <ManselPanelVstupu
              :dataVstupy="dataTabulky"
              v-on:ValueChanged="handleValueChanged"
              v-on:CellDoubleClicked="handleCellDoubleClicked"
            />
          </div>
        </div>

        <!--<div class="mansel-vck-pata">
        <div class="mansel-vck-pata-text">
          Vyrobeno firmou
          <a target="_blank" href="http://www.viklan.cz"
            >VIKLAN SOFTWARE s.r.o.</a
          >
        </div>
      </div>-->
        <v-overlay :value="bLoading" color="mansel-vck-progress-panel-bg">
          <v-progress-circular
            indeterminate
            size="128"
            color="mansel-vck-progress-symbol"
            :width="10"
          ></v-progress-circular>
        </v-overlay>

        <canvas class="canvasVCKTextWidth"></canvas>
      </div>
    </div>


    <v-dialog v-model="varovaniDialog" persistent max-width="400">
      <v-card>
        <br />
        <v-card-text>{{ varovaniMsg }}</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="varovaniDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable */

import axios from "axios";
import { version } from "vue";
import ManselPanelVstupu from "./ManselPanelVstupu.vue";

export default {
  name: "ManselVCK1",
  props: {
    produkt: String,
    jazyk: String,
    url: String,
    sirkaInfoVstupyRedukovana: String,
    bHeaderShow: Boolean
  },
  components: {
    ManselPanelVstupu,
  },

  watch: {
    produkt: function (newVal /*, oldVal*/) {
      if (newVal) {
        this.reloadComponent(null, false);
      }
    }/*,
    bLoading (val) {
        val && setTimeout(() => {
          this.bLoading = false
        }, 10000)
      }*/
  },

  mounted: function() {
    if (this.$refs.nadpis)
      {
        if (this.$vuetify.theme.currentTheme["mansel-vck-header-text"]) this.$refs.nadpis.classList.add("mansel-vck-header-text--text");
          else this.$refs.nadpis.classList.add("mansel-vck-header-text");      
      }

    
  },

  data() {
    return {
      vue_version: version,
      varovaniDialog: false,
      varovaniMsg: "",
      dataVstupy: null,
      dataVystupy: null,
      dataHlucnost: null,
      dataTabulky: null,
      vystupniParametry: null,
      nadpis: "",
      bLoading: false,
      bChyba: false,
      bInit: true,
      chyba: "",
      bHlucnost: false,
      fullscreenClass: {"mansel-vck-fullscreen" : false},
      btnRezimZobrazeniClass: {"mansel-vck-btn-rezim-fullscreen" : true, "mansel-vck-btn-rezim-shrink" : false}
    };
  },

  created: function () {
    this.reloadComponent(null, false);
  },

  updated: function() {    
    this.$nextTick(() => {
      const elem = document.querySelector('.mansel-vck-vstup-popis');
      if (elem)
      {
        const font = window.getComputedStyle(elem);

        var sirkaPopisMax = 0;
        this.dataVstupy.map(function(objVstup) 
        {        
          if (objVstup.TYP == "DESCR" && objVstup.NADPIS_TYP < 0) return;

          var sirkaPopis = this.vklGetWidthOfText(objVstup.TEXT, font.fontFamily, font.fontSize, font.fontWeight) + 30;

          if (sirkaPopis > sirkaPopisMax) sirkaPopisMax = sirkaPopis;
        }, this);

        this.dataVystupy.map(function(objVstup) 
        {        
          if (objVstup.TYP == "DESCR" && objVstup.NADPIS_TYP < 0) return;
          
          var sirkaPopis = this.vklGetWidthOfText(objVstup.TEXT, font.fontFamily, font.fontSize, font.fontWeight) + 30;
          
          if (sirkaPopis > sirkaPopisMax) sirkaPopisMax = sirkaPopis;
        }, this);


        if (sirkaPopisMax > 0) 
        {
          this.$el.querySelectorAll(".mansel-vck-vstup-popis").forEach((vstupPopis) => {       
            vstupPopis.style.maxWidth = sirkaPopisMax + "px";
            vstupPopis.style.minWidth = sirkaPopisMax + "px";
          }); 
        }
      }
    });      
  },

  methods: {
    userGUID: function () {
      var current = window.localStorage.getItem("vkl_user_id");
      if (current) return current;

      var id = this.vklUUID();
      window.localStorage.setItem("vkl_user_id", id);

      return id;
    },

    reloadComponentClick:function (event) {
      this.reloadComponent(null, false);
    },

    reloadComponent: function (objZmenyParamStr, doubleClickOrigin) {
      const start = Date.now();

      const dataPost = {
        uzivatel_guid: this.userGUID(),
        jazyk: this.jazyk,
        akce: "PRODUKT_RELOAD",
        produkt: this.produkt,
        data: {
          ZmenyVstupy: objZmenyParamStr,
          ZmenyVstupParametry: [],
        },
      };

      const config = {
          headers: {
              'Content-Type': 'text/plain',
          },
          responseType: 'text'
      };


      this.bLoading = true;
      this.chyba = "";
      axios
        .post(this.url, dataPost, config)
        .then((response) => {
          const data = JSON.parse(response.data);

          this.bLoading = false;          
          this.bChyba = false;
          this.bInit = false;

          if (data.res == "ok") {
            this.dataVstupy = data.data[1];
            this.dataVystupy = data.data[2];
            this.dataHlucnost = data.data[3];
            this.dataTabulky = data.data[5];
            this.vystupniParametry = data.data.VYSTUPNI_PARAMETRY;

            this.bHlucnost = (data.data.MASKA === "2");
            
            this.nadpis = data.data.PRODUKT;
            this.$emit('reloadDataEvent', data.data.VYSTUPNI_PARAMETRY);


            if (doubleClickOrigin) this.$emit('cellDoubleClickedEvent', data.data.VYSTUPNI_PARAMETRY);

            if (data.varovani != "")
            {             
              this.varovaniMsg = data.varovani;
              this.varovaniDialog = true;               
            }

          } else {
            this.chyba = data.msg;
            this.bChyba = true;
            console.log(data.msg);
          }

          const end = Date.now();
          //console.log(`Execution time: ${end - start} ms`);
        })
        .catch((e) => {
          this.bLoading = false;
          this.bInit = false;
          
          this.bChyba = true;
          this.chyba = e;
            
          console.log(e);
        });
    },

    saveDataToString: function () {
      const dataPost = {
        uzivatel_guid: this.userGUID(),
        jazyk: this.jazyk,
        akce: "PRODUKT_ULOZITVSTUPY",
        produkt: this.produkt,
        data: {},
      };

      const config = {
          headers: {
              'Content-Type': 'text/plain',
          },
          responseType: 'text'
      };

      return axios.post(
        this.url,
        dataPost,
        config
      ).then((response) => { return JSON.parse(response.data) });
    },

    resetVstupy: function () {
      const dataPost = {
        uzivatel_guid: this.userGUID(),
        jazyk: this.jazyk,
        akce: "PRODUKT_RESET",
        produkt: this.produkt,
        data: {},
      };

      const config = {
          headers: {
              'Content-Type': 'text/plain'
          },
          responseType: 'text'
      };

      this.bLoading = true;      
      axios
        .post(this.url, dataPost, config)
        .then((response) => {
          this.bLoading = false;         
          const data = JSON.parse(response.data);

          if (data.res == "ok") {
            this.dataVstupy = data.data[1];
            this.dataVystupy = data.data[2];
            this.dataHlucnost = data.data[3];
            this.dataTabulky = data.data[5];
            this.vystupniParametry = data.data.VYSTUPNI_PARAMETRY;

            this.bHlucnost = (data.data.MASKA === "2");
            
            this.nadpis = data.data.NADPIS;
            this.$emit('reloadDataEvent', data.data.VYSTUPNI_PARAMETRY);
          } else {
            this.chyba = data.msg;
            this.bChyba = true;
            console.log(data.msg);
          }
        })
        .catch((e) => {
          this.bLoading = false;
          console.log(e);
        });
    },

    loadDataFromString: function (dataVstupy) {

      const dataPost = {
        uzivatel_guid: this.userGUID(),
        jazyk: this.jazyk,
        akce: "PRODUKT_NACISTVSTUPY",
        produkt: this.produkt,
        data: dataVstupy,
      };

      const config = {
          headers: {
              'Content-Type': 'text/plain'
          },
          responseType: 'text'
      };

      this.bLoading = true;      
      axios
        .post(this.url, dataPost, config)
        .then((response) => {
          this.bLoading = false;         
          const data = JSON.parse(response.data);
          
          if (data.res == "ok") {
            
            this.dataVstupy = data.data[1];
            this.dataVystupy = data.data[2];
            this.dataHlucnost = data.data[3];
            this.dataTabulky = data.data[5];
            this.vystupniParametry = data.data.VYSTUPNI_PARAMETRY;

            this.bHlucnost = (data.data.MASKA === "2");
            
            this.nadpis = data.data.NADPIS;
            this.$emit('reloadDataEvent', data.data.VYSTUPNI_PARAMETRY);

            if (data.varovani != "")
            {             
              this.varovaniMsg = data.varovani;
              this.varovaniDialog = true;               
            }
          } else {
            this.chyba = data.msg;
            this.bChyba = true;
            console.log(data.msg);
          }

          const end = Date.now();
          console.log(`Execution time: ${end - start} ms`);
        })
        .catch((e) => {
          this.bLoading = false;
          console.log(e);
        });
    },

    handleValueChanged: function (value, unit, vstup, doubleClickOrigin) {
      var objZmenyParam = new Array();
      var objPar = new Object();
      objPar.strom = vstup.STROM;
      objPar.param = vstup.PARAMETR;
      objPar.hodn = value;
      objPar.jedn = unit;

      objZmenyParam.push(objPar);


      

      /*var objZmenyParamStr =
        objZmenyParam == null ? "" : JSON.stringify(objZmenyParam);*/
      this.reloadComponent(objZmenyParam, doubleClickOrigin);      
    },

    handleCellDoubleClicked: function (value, unit, vstup) {
      
    },
    

    vklUUID: function () {
      var u = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );

      return u;
    },
    vklGetWidthOfText(txt, fontname, fontsize, fontweight)
    {       
      const canvas = document.getElementsByClassName("canvasVCKTextWidth")[0];
      const ctx = canvas.getContext("2d");
      ctx.font = fontweight + ' ' + fontsize + ' ' + fontname;   

      let text = ctx.measureText(txt);
      return text.width;
    },

    rezimObrazovka()
    {
      if (this.bFullscreen)
      {
        this.bFullscreen = false;
        this.fullscreenClass = {"mansel-vck-fullscreen" : false};
        this.btnRezimZobrazeniClass = {"mansel-vck-btn-rezim-fullscreen" : true, "mansel-vck-btn-rezim-shrink" : false};        
      }
      else
      {
        this.bFullscreen = true;
        this.fullscreenClass = {"mansel-vck-fullscreen" : true};
        this.btnRezimZobrazeniClass = {"mansel-vck-btn-rezim-fullscreen" : false, "mansel-vck-btn-rezim-shrink" : true}; 
      }
    }
  }
};
</script>

<style>
  @import '@/assets/styles.css';
</style>

<style scoped>

.mansel-vck-header-container {
  display: flex; /* In vuetify you have class that's sets it: "d-flex" */
  min-height: 42px;
  width: 100%;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  padding-top:3px;
  padding-right:3px;
}

.mansel-vck-header {
  width: 100%;
  padding: 5px 5px 0px 5px;
}

.mansel-vck-header-left {
  padding-top: 8px;
  width: 100%;
}

.mansel-vck-header-right {
  width: 200px;
}




.mansel-vck-pnlPrazdny {
  width: 100%;
  height: 100%;
  text-align: center;
  font-weight: bold;
  color: black;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
}

.mansel-vck-pnlHorniLevy {
  width: 100%; 
  float: none; 
  clear: left;
  position: relative;
}

.mansel-vck-pnlHorniLevyChyba {
  position: absolute;
  width: calc(100% - 10px); 
  height: 100%;
  height: 150px;
  margin: 5px;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  color: red;
  z-index: 10;

}


.mansel-vck-fullscreen {
    z-index: 99;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0;
    background-color: white;
    overflow: auto;
}


.mansel-vck-btn-rezim-fullscreen {
  background-size: auto;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url("../assets/fullscreen.png");
}

/*.mansel-vck-loading {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url("..\\assets\\waitloader.gif");
  }*/

.mansel-vck-btn-rezim-shrink {
  background-size: auto;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url("../assets/shrink.png");
}

.mansel-vck-btn-rezim-zobrazeni {
  min-width: 40px !important;
  padding: 0px !important;
}



</style>
