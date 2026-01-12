// Import vue component
import ManselVCK1 from './components/ManselVCK1.vue'

function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component("mansel-vck1", ManselVCK1);
}

const plugin = {
	install,
};

let GlobalVue = null;
if (typeof window !== "undefined") {
	GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
	GlobalVue = global.vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

ManselVCK1.install = install;

export default ManselVCK1;