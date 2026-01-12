<template>
    <div class="pnlTabulka-cela">
          <div class="mansel-vck-vstup-hodnota mansel-vck-vstupy-text--text">
            <div v-bind:class="getClassNadpis()">{{vstupdata.TEXT}}</div>
          </div>

          <div class="pnlTabulka-hlav">
            <v-tabs ref="tabs" v-if="!(bTabulkaHlucnosti)">
                <v-tab v-for="(dataTab, index) in dataTabs" :key="index" @click="changeTable" :tabindex="index">{{dataTab.POPIS}}</v-tab>
            </v-tabs>
          </div>
          <div>
            <ManselTabulator :dataTab="dataTabSel" :columns="columns" v-on:CellSelected="cellSelected" v-on:CellDoubleClicked="cellDoubleClicked" :bTabulkaHlucnosti="bTabulkaHlucnosti"/>
          </div>
    </div>
</template>


<script>
/* eslint-disable */

import ManselTabulator from "./ManselTabulator.vue"

export default {
  props: {
    vstupdata: Object,
    bTabulkaHlucnosti: Boolean
  },
  data() {
    return {
       dataTabSel: Object,
       indexSel: Number,
       columns: Object,
       dataTabs: Object,
       nadpis_typ: String
    }
  },
  components: {
    ManselTabulator
  },
  watch: { 
      vstupdata: function(newData) { 
        if (newData) this.updateData(newData);

      }
  },
  created: function() {
     this.indexSel = 0;
     if (this.vstupdata) this.updateData(this.vstupdata);
  },


  methods: {
    getClassNadpis() {
      if (this.nadpis_typ == 3) return {"mansel-vck-nadpis3" : true};
      else if (this.nadpis_typ == 2) return {"mansel-vck-nadpis2" : true};
      else return {"mansel-vck-nadpis1" : true};
    },

    cellSelected(value) {
      this.$emit('ValueChanged', value, "", this.vstupdata, false);
    },

    cellDoubleClicked(value) {
      this.$emit('ValueChanged', value, "", this.vstupdata, true);      
    },


    changeTable(event)
    {
       this.indexSel = event.target.getAttribute("tabindex");
       this.dataTabSel = this.dataTabs[this.indexSel];
    },

    updateData(newData)
    {      
      this.nadpis_typ = newData.NADPIS_TYP;
      const bTabulkaHlucnosti = this.bTabulkaHlucnosti;
      if (this.indexSel < 0 || this.indexSel >= newData.TABULKY.length) this.indexSel = 0;

      const dataTabSelNew = newData.TABULKY[this.indexSel];
      this.dataTabSel = dataTabSelNew;
      this.dataTabs = newData.TABULKY;

      const sirkaOkrajeBunek = 5;
      
      const fontTabDefault = window.getComputedStyle(document.querySelector('.ManselVCK1'));
      const fontname = fontTabDefault.fontFamily;
      const fontsize = fontTabDefault.fontSize;
      const fontweight = fontTabDefault.fontWeight;

      const maxSirkaSloupceProData = Math.ceil(this.vklMaximalniSirkaTextuTab(newData, fontname, fontsize, fontweight, true) + sirkaOkrajeBunek);
      const maxSirkaSloupceHeaderSvisly = Math.ceil(this.vklMaximalniSirkaTextuTabPouzeSloupecPopis(newData, fontname, fontsize, fontweight) + sirkaOkrajeBunek);

      var arrOsaX = [];
      newData.POPISYX.map(function(x, indexCol) {
        var objCol = new Object();
        objCol["field"] = x.I;
        objCol["title"] = "" + x.P == "" ? "XX" : x.P;
        objCol["headerSort"] = false;
        objCol["width"] = maxSirkaSloupceProData;  

        if (x.I == "RH")        
        {
          objCol["width"] = maxSirkaSloupceHeaderSvisly + 10;            
          /*
          var fontname = vklFontFromDiv(pnlTabulka);
                      var fontsize = $(pnlTabulka).css('font-size');
                      var fontweight = $(pnlTabulka).css('font-weight');
            
            var sirkaPopisLevyRoh = vklGetWidthOfText(DATA.POPISXY, fontname, fontsize, "bold") + sirkaOkrajeBunekHlav;	
            if (sirkaPopisLevyRoh > maxSirkaSloupceProData) objCol["width"] = sirkaPopisLevyRoh;  
            
            objCol["formatter"] = function(cell, formatterParams){
                  var value = cell.getValue();
                  cell.getElement().css("background-color", "#E5E5E5");
                  cell.getElement().css("font-weight", "bold");
                  
                  return value;
            }
            */
          objCol["frozen"] = true;
          
          if (indexCol == 0) objCol["title"] = dataTabSelNew.POPISXY;  //text do leveho horniho rohu
        }
        else
        {
          if (bTabulkaHlucnosti)
          {
            objCol["formatter"] = function(cell, formatterParams){
                  var value = cell.getValue();
                  var indexRow = cell._cell.row.data.rowIndex;
                  
                  if (value == "#ZAKHODN!") value = "-";
                  else
                  {
                    var tooltip = newData.TABCHYBY[indexRow][indexCol - 1]; //-1 protoze data obsahuji na indexu 0 row-header
                    if ("" + tooltip != "")
                    {
                      value = "<div style='float:left;'>" + value + "</div><div class='tabulator-cell-err' title='" + tooltip + "'></div>"; 
                    }
                  }                   
                  
                  return value;
            };
          }
          else
          {
            objCol["formatter"] = function(cell, formatterParams){
                  var value = cell.getValue();
                  var indexRow = cell._cell.row.data.rowIndex;
                  
                  if (value == "#ZAKHODN!") value = "-";
                  else
                  {
                    var tooltip = newData.TABCHYBY[indexRow][indexCol - 1]; //-1 protoze data obsahuji na indexu 0 row-header
                    if ("" + tooltip != "")
                    {
                      value = "<div style='float:left;'>" + value + "</div><div class='tabulator-cell-err' title='" + tooltip + "'></div>"; 
                    }
                  } 
                  
                  if (indexCol - 1 == newData.COLINDEXSEL && indexRow == newData.ROWINDEXSEL)
                  {
                    cell.getElement().classList.add("mansel-vck-tabulka-selcell-bg");    
                    cell.getElement().classList.add("mansel-vck-tabulka-selcell-text--text");                              
                  }

                  return value;
            };
          }
        }	 

        arrOsaX.push(objCol);
      });

      this.columns = arrOsaX;

      /*console.log(this.$refs);
      console.log(this.$refs.tabs);*/
      
      this.$refs.tabs && this.$refs.tabs.onResize();
    },

    vklMaximalniSirkaTextuTab(dataParametruTab, fontname, fontsize, fontstyle, bVcSloupcePopisu)
    {
      var maxSirka = 20;
      if (bVcSloupcePopisu)
      {
        dataParametruTab.POPISYX.map(function(x, indexCol) 
        {          
          var sirka = this.vklGetWidthOfText(x.P, fontname, fontsize, "bold") + 5;
          if (sirka > maxSirka) 
          {
            maxSirka = sirka;
          }
        }, this);
      }

      dataParametruTab.TABULKY.map(function(objTab, index) 
      {        
        if (bVcSloupcePopisu)
        {
          var sirka = this.vklGetWidthOfText(objTab.POPISXY, fontname, fontsize, "bold") + 10;	 

          if (sirka > maxSirka) maxSirka = sirka;
        }

        objTab.DATA.map(function(dr, indexR) 
        {          
          dataParametruTab.POPISYX.map(function(indexVal, indexCol)
          {	    		
            const value = dr[indexCol];
            if (indexCol != "RH")
            {				
              sirka = 20 + 20;
              if (value != "#ZAKHODN!") sirka = this.vklGetWidthOfText(value, fontname, fontsize, fontstyle) + 20;	
              
              if (sirka > maxSirka) maxSirka = sirka;
            }
          }, this);
        }, this);
      }, this);

      return maxSirka;
    },

    vklMaximalniSirkaTextuTabPouzeSloupecPopis(dataParametruTab, fontname, fontsize, fontstyle)
    {
      var maxSirka = 20;

      dataParametruTab.TABULKY.map(function(objTab, index) 
      {        
        var sirka = this.vklGetWidthOfText(objTab.POPISXY, fontname, fontsize, "bold") + 5;	          
        if (sirka > maxSirka) maxSirka = sirka;

        objTab.DATA.map(function(dr, indexR) 
        {
            const value = dr["RH"];			
            sirka = this.vklGetWidthOfText(value, fontname, fontsize, fontstyle) + 20;	

            if (sirka > maxSirka) maxSirka = sirka;
        }, this);
      }, this);
      
      return maxSirka;
    },


/*
    vklMaximalniSirkaTextuTabBezRowHeader(dataParametruTab, fontname, fontsize, fontstyle)
    {
      var maxSirka = 20;

      dataParametruTab.POPISYX.map(function(x, indexCol) 
      {
        var sirka = this.vklGetWidthOfText(x.P, fontname, fontsize, "bold") + 5;
        if (sirka > maxSirka) 
        {
          maxSirka = sirka;
        }
      });
      
      dataParametruTab.TABULKY.map(function(objTab, index) 
      {
        var sirka = this.vklGetWidthOfText(objTab.POPISXY, fontname, fontsize, "bold") + 5;	
        if (sirka > maxSirka) maxSirka = sirka;
                
        objTab.DATA.map(function(dr, indexR) 
        {
          dataParametruTab.POPISYX.map(function(index, indexCol)          
          {	    		
            const value = dr[index];
            if (indexCol != "RH")
            {				
              sirka = 20 + 20;
              if (value != "#ZAKHODN!") sirka = this.vklGetWidthOfText(value, fontname, fontsize, fontstyle) + 20;	

              if (sirka > maxSirka) maxSirka = sirka;
            }
          });
        });
      });
      
      return maxSirka;
    },

   ,*/

    vklGetWidthOfText(txt, fontname, fontsize, fontweight)
    {       
      const canvas = document.getElementsByClassName("canvasVCKTextWidth")[0];
      const ctx = canvas.getContext("2d");
      ctx.font = fontweight + ' ' + fontsize + ' ' + fontname;   

      let text = ctx.measureText(txt);      
      return text.width;
    }

  }
}

</script>

<style>
.pnlTabulka-hlav {
    width: 100%;
    height: auto;
    margin-bottom: 5px;
}

.mansel-vck-btn-tab {
  display:inline;

}

.mansel-vck-btn-tab button {
  display:inline;
  margin: 2px;
}


button span {
  pointer-events: none;
  text-transform: none;
}



.tabulator-cell-err {
    float: left;
    margin-left: 5px;
    width: 16px;
    height: 16px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('../assets/error.png');
}

.tabulator .tabulator-header .tabulator-col .tabulator-col-content {
  padding: 5px !important;
}
</style>