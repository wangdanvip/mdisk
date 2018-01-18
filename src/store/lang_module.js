import {
  SET_CH,
  SET_EN,
  set_left_menu_w_max,
  set_left_menu_w_min,
  set_search_w_max,
  set_search_w_min,
  TOGGLE_MASK
} from './types'
import getters from './getters'

let language_version='';

if(window.localStorage.getItem('locale')!==null){
  language_version = window.localStorage.getItem('locale');
}else{
  language_version = (navigator.language || navigator.browserLanguage).toLowerCase()==='zh-cn'?'zh':'en';
}

const state = {
  language_version: language_version,
  left_menu_w: '260',
  search_w:'280',
  mask: {
    show: 0
  }
};

const mutations = {
  [SET_CH](state) {
    window.localStorage.setItem('locale','zh');
    state.language_version='zh';
    window.location.reload()
  },
  [SET_EN](state) {
    window.localStorage.setItem('locale','en');
    state.language_version='en';
    window.location.reload()
  },
  [set_left_menu_w_max](state) {
    state.left_menu_w='260';
  },
  [set_left_menu_w_min](state) {
    state.left_menu_w='48';
  },
  [set_search_w_max](state) {
    state.search_w='280';
  },
  [set_search_w_min](state) {
    state.search_w='0';
  },
  [TOGGLE_MASK] (state, p) {
    if (p) {
      state.mask.show += 1
    } else {
      if (state.mask.show > 0) {
        state.mask.show -= 1
      }
    }
  }
};

export default {
	state,
	mutations,
	getters
}
