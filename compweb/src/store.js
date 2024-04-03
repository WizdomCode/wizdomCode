// store.js
import { createStore } from 'redux';

const initialState = {
  tabs: [
    { type: 'newTab', data: null },
  ],
  currentTab: { type: 'newTab', data: null },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TAB':
      return {
        ...state,
        tabs: [...state.tabs, action.payload],
      };
    case 'REMOVE_TAB':
      return {
        ...state,
        tabs: state.tabs.filter(tab => tab !== action.payload),
      };
    case 'SET_CURRENT_TAB':
      return {
        ...state,
        currentTab: action.payload,
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
