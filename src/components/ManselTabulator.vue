<template>
  <div class="tabulator-div">
    <VueTabulator
      v-model="tableData"
      :options="options"
      :integration="{ updateStrategy: 'REPLACE' }"
      @cell-click="cellClick"
      @cell-dbl-click="cellDblClick"
      ref="tabulator"
      class="mansel-vck-tabulka-bg"
    />
  </div>
</template>

<script>
import VueTabulator from "vue-tabulator";
import Vue from 'vue';

Vue.use(VueTabulator);

export default {
  props: {
    dataTab: Object,
    columns: Array,
    bTabulkaHlucnosti: Boolean
  },
  data() {
    return {
      tableData: [], //data for table to display.
      mounted: 0,
      options: null,
      scrollTopLast: 0,
      scrollLeftLast: 0,
      valSelected: null,
      clickedTimes: 0
    };
  },
  mounted() {
    this.mounted = 1;

    if (this.dataTab)this.updateData(this.dataTab);
  },
  watch: {
    dataTab: function (newData) {
      //const tabulatorInstance = this.$refs.tabulator.getInstance();

      
      if (!this.bTabulkaHlucnosti)
      {
        const tabHolder = this.$refs.tabulator.$el.querySelector(".tabulator-tableHolder");
        this.scrollTopLast = tabHolder.scrollTop;
        this.scrollLeftLast = tabHolder.scrollLeft;
      }

      if (newData) this.updateData(newData);
    },
  },
  created: function () {
    if (this.dataTab) this.updateData(this.dataTab);
  },
  updated: function () {
    if (!this.bTabulkaHlucnosti)
    {

      const elements = document.getElementsByClassName("tabvalue");

      var doubleClickEvent = function(event) {
          event.stopPropagation();
          alert("DCLK");
      };

      for (var i = 0; i < elements.length; i++) {
          elements[i].addEventListener('dblclick', doubleClickEvent, false);
      }

      /*cellHodnoty[0].ondblclick = function(event) {
          
      }*/


        const tabHolder = this.$el.querySelector(".tabulator-tableHolder");
        const tabBody = this.$el.querySelector(".tabulator-table");

        tabHolder.scrollLeft = this.scrollLeftLast;
        tabHolder.scrollTop = this.scrollTopLast;  

        var sirkaSloupceCelkem = 4; 
        if (tabBody.offsetHeight > tabHolder.offsetHeight) sirkaSloupceCelkem += 22;

        this.$refs.tabulator.$el.getElementsByClassName("tabulator-col").forEach(element => {
          sirkaSloupceCelkem += element.offsetWidth;
        });

        if (sirkaSloupceCelkem < this.$el.offsetWidth) this.$refs.tabulator.$el.style.maxWidth = sirkaSloupceCelkem + "px";
        else this.$refs.tabulator.$el.style.maxWidth = "100%";
    }
    else
    {
      const tabHeader = this.$el.getElementsByClassName("tabulator-header");
      tabHeader[0].classList.add("tabulkaheaderbg");

      var maxSirkaTab = 4; 
      this.$refs.tabulator.$el.getElementsByClassName("tabulator-col").forEach(element => {
        maxSirkaTab += element.offsetWidth;
      });

      this.$refs.tabulator.$el.style.maxWidth = maxSirkaTab + "px";
      this.$refs.tabulator.$el.style.minWidth = maxSirkaTab + "px";

      this.$refs.tabulator.$el.getElementsByClassName("tabulator-tableHolder")[0].classList.add("scrollHidden");      
    }
  },

  methods: {    
    updateData(newData) {
      if (this.mounted == 1) {       

        for (var iR = 0; iR < newData.DATA.length; iR++)
        {
          newData.DATA[iR].rowIndex = iR;
        }

        this.tableData = newData.DATA;
        const layoutTyp = this.bTabulkaHlucnosti ? "fitDataTable" : "fitData";
        
        this.options = { columns: this.columns, layout: layoutTyp, dataLoaded: this.dataLoaded,   layoutColumnsOnNewData:true  };
      }
    },

    cellClick(e, cell) {
      if (!this.bTabulkaHlucnosti)
      {
        var value = cell.getValue();	    				
        if (value == "#ZAKHODN!") return;
        
        var iR = cell._cell.row.data.rowIndex;
        const iC = this.columns.findIndex(col => col.field == "" + cell._cell.column.field); 

        var val = iR + ";" + (iC-1);
        

        if (this.valSelected == val) return;

        this.clickedTimes = 1;
        this.valSelected = val;

        setTimeout(() => {
            if (this.clickedTimes === 1) {
              this.$emit('CellSelected', val);
            } else if (this.clickedTimes >= 2) {
              this.$emit('CellDoubleClicked', val);
            }
            this.clickedTimes = 0;
         }, 200);

        
      }
    },
    
    
    
      


    cellDblClick(e, cell) {
      if (!this.bTabulkaHlucnosti)
      {
        var value = cell.getValue();	    				
        if (value == "#ZAKHODN!") return;
        
        //var iR = cell._cell.row.data.rowIndex;
        //const iC = this.columns.findIndex(col => col.field == "" + cell._cell.column.field); 

        //var val = iR + ";" + (iC-1);
        this.clickedTimes++;       
      }
    },
    
    /*
          @cell-context="cellContext"
    
    cellContext(e, cell) {      
        console.log("CONTEXT");
        console.log(e);
        console.log(cell);
    },

          @cell-tap-hold="cellTap"


    cellTap(e, cell) {  
        alert (cell._cell.row.data.rowIndex + " x "+ cell._cell.column.field);    
        console.log("TAP");
        console.log(e);
        console.log(cell);
    },*/

    dataLoaded() {
        
    }
  },
};
</script>

<style lang="scss">
@import "~vue-tabulator/dist/scss/bootstrap/tabulator_bootstrap4";


.tabulator-div {
  table-layout: fixed;
  width: 100%;
  overflow-x: auto;
}

.scrollHidden {
    overflow:hidden !important;
}




  
  .tabulator-row .tabulator-frozen.tabulator-frozen-left {
      /*background-color: #607d8b;*/
      font-weight: bold;
      border-right: 1px solid gray;
  }

  .tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-left {
    border-right: 1px solid gray;
  
  }  
  .tabulator .tabulator-header {
    /*background-color: #607d8b;*/
    border-bottom: 1px solid gray;
    border-top: none;
  }
  .tabulator .tabulator-header .tabulator-col {
    /*background-color: #607d8b;*/
    /*border-right: 1px solid gray;*/
  }  
  .tabulator-row .tabulator-cell {
      padding: 5px;
      /*border-right: 1px solid gray;*/
      background-color: white;
      color:black;
  }  
  .tabulator-row {
    min-height: 20px;
    /*border-bottom: 1px solid gray;*/

  }
  
  .tabulator-tableHolder {
    max-height: 600px !important;
  }
</style>
