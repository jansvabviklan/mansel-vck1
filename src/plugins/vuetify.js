import Vue from 'vue'
import Vuetify from 'vuetify/lib'
//import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)


export default new Vuetify({
  theme: { dark: false },
})

/*
const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        'mansel-vck-jednotky-bg': colors.blueGrey,
        'mansel-vck-jednotky-text': "#000000",      

        'mansel-vck-panel-bg' : colors.blue.lighten3,
        'mansel-vck-panel-text' : "#000000",

        'mansel-vck-header-bg' : colors.blue.darken4,
        'mansel-vck-header-text' : "#FFFFFF",

        'mansel-vck-button-bg' : colors.blueGrey,
        'mansel-vck-button-text' : "#000000",

        'mansel-vck-button-bg-sel' : colors.blueGrey.darken4,
        'mansel-vck-button-text-sel' : "#FFFFFF",
        
        'mansel-vck-vstupy-text' : "#000000",

        'mansel-vck-info-vstupy-bg' : colors.yellow.lighten4,
        'mansel-vck-info-vstupy-text' : "#000000",  

        'mansel-vck-seznam-vstupy-bg' : "#FFFFFF",
        'mansel-vck-seznam-vstupy-text' : "#000000",

        'mansel-vck-mminput-vstupy-bg' : "#FFFFFF",
        'mansel-vck-mminput-vstupy-text' : "#000000",
        'mansel-vck-mminput-vstupy-meze-text' : "#000000",

        'mansel-vck-input-vstupy-bg' : "#FFFFFF",
        'mansel-vck-input-vstupy-text' : "#000000",

        'mansel-vck-tabulka-selcell-bg' : colors.blueGrey.darken4,
        'mansel-vck-tabulka-selcell-text' : "#FFFFFF",

        'mansel-vck-tabulka-cell-bg' : "#FFFFFF",
        'mansel-vck-tabulka-cell-text' : "#000000",

        'mansel-vck-tabulkaheader-bg' : colors.blueGrey,
        'mansel-vck-tabulkaheader-text' : "#000000",

        'mansel-vck-progress-symbol' : colors.blue.darken4,
        'mansel-vck-progress-panel-bg' : "#FFFFFF"
      }
    },
  },
});

export default vuetify*/
