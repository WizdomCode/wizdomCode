// store.js
import { createStore } from 'redux';

const initialState = {
  tabs: [
    { type: 'newTab', data: null },
  ],
  lessonTab: {
    division: '',
    lesson: '',
    problem_id: '',
  },
  codeState: { // modified code state
    language: '',
    code: '',
  },
};

initialState.currentTab = initialState.tabs[0];

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TAB':
      return {
        ...state,
        tabs: [...state.tabs, action.payload],
        currentTab: action.payload,
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
    case 'SET_LESSON_TAB':
      return {
        ...state,
        lessonTab: {
          ...state.lessonTab,
          ...action.payload,
        },
      };
    case 'SET_CODE_STATE': // modified case to handle code state
      return {
        ...state,
        codeState: {
          ...state.codeState,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
