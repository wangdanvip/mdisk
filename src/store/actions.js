import * as types from './types'

export default {
  SET_CH: ({
    commit
  }) => {
    commit(types.SET_CH);
  },
  SET_EN: ({
    commit
  }) => {
    commit(types.SET_EN);
  },
  set_left_menu_w_max: ({
    commit
  }) => {
    commit(types.set_left_menu_w_max);
  },
  set_left_menu_w_min: ({
    commit
  }) => {
    commit(types.set_left_menu_w_min);
  },
  set_search_w_max: ({
    commit
  }) => {
    commit(types.set_search_w_max);
  },
  set_search_w_min: ({
    commit
  }) => {
    commit(types.set_search_w_min);
  },
  toggleMask: ({ commit }, show) => commit(types.TOGGLE_MASK, show)
}
