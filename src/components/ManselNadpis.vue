<template>
      <div class="mansel-vck-vstup-container">
        <div class="mansel-vck-vstup-hodnota mansel-vck-vstupy-text--text">
          <div v-bind:class="getClass()" v-html="vstupdata.TEXT"></div>
          <div v-bind:class="getClassTooltip()" v-bind:title="vstupdata.TEXTTOOLTIP" v-show="tooltipEnabled"></div>
        </div>  
      </div>   
</template>


<script>
export default {
  props: {
    vstupdata: Object
  },
  data() {
    return {
          tooltipEnabled: false,
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
  
  methods: {
    getClass() {
      if (this.vstupdata.NADPIS_TYP == 3) return {"mansel-vck-nadpis3" : true};
      else if (this.vstupdata.NADPIS_TYP == 2) return {"mansel-vck-nadpis2" : true};
      else if (this.vstupdata.NADPIS_TYP == 1) return {"mansel-vck-nadpis1" : true};
      else if (this.vstupdata.NADPIS_TYP == -1) return {"mansel-vck-nadpis_pozn1" : true};
      else return {"mansel-vck-nadpis3" : true};
    },

    getClassTooltip() 
    {
      if (this.vstupdata.UROVENTOOLTIP == 3) return {"tooltip-err" : true};
      else if (this.vstupdata.UROVENTOOLTIP == 2) return {"tooltip-warn" : true};
      else if (this.vstupdata.UROVENTOOLTIP == 1) return {"tooltip-info" : true};
      else return {};
    },

    updateData(newData) {
        this.tooltipEnabled = newData.UROVENTOOLTIP > 0;
    }
  }
}

</script>


<style>

.tooltip-err {
    float: left;
    margin-left: 5px;
    width: 16px;
    height: 16px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('../assets/error.png');
}

.tooltip-warn {
    float: left;
    margin-left: 5px;
    width: 16px;
    height: 16px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('../assets/warning.png');
}

.tooltip-info {
    float: left;
    margin-left: 5px;
    width: 16px;
    height: 16px;
    background-size: auto;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url('../assets/info.png');
}

</style>