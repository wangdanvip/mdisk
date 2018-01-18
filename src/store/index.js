import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import lang_module from './lang_module'
import actions from './actions'


export default new Vuex.Store({
	modules:{
    lang_module
	},
	actions
});
