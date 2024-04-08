// store.js
import { createStore } from 'redux';

const initialState = {
  tabs: [
    { type: 'newTab', data: null },
  ],
  lessonTabs: [],
  lessonMetaData: {
    unit: NaN,
    lesson: NaN,
    problem_id: '',
  },
  lessonProblemData: {
    contest: '',
    description: '',
    folder: '',
    inputFormat: '',
    outputFormat: '',
    points: NaN,
    title: '',
    topics: [],
  },
  lessonActiveTab: { type: '', data: null },
  codeState: { // modified code state
    language: '',
    code: '',
  },
  lessonTabIndex: 0,
  inputOutputTab: 'input',
  inputData: '',
  outputData: ''
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
    case 'ADD_LESSON_TAB':
      return {
        ...state,
        lessonTabs: [...state.tabs, action.payload],
        lessonTab: action.payload,
      };
    case 'REMOVE_TAB':
      const newTabs = state.tabs.filter(tab => tab !== action.payload);
      let newCurrentTab = state.currentTab;
      if (state.currentTab === action.payload) {
        const index = state.tabs.indexOf(action.payload);
        newCurrentTab = index < newTabs.length ? newTabs[index] : newTabs[newTabs.length - 1];
      }
      return {
        ...state,
        tabs: newTabs,
        currentTab: newCurrentTab,
      };
    case 'CLEAR_LESSON_TABS':
      return {
        ...state,
        lessonTabs: [],
      };  
    case 'SET_CURRENT_TAB':
      return {
        ...state,
        currentTab: action.payload,
      };
    case 'SET_LESSON_TAB':
      return {
        ...state,
        lessonActiveTab: action.payload,
      };
    case 'SET_LESSON_META_DATA':
      return {
        ...state,
        lessonMetaData: {
          ...state.lessonMetaData,
          ...action.payload,
        },
      };
    case 'SET_LESSON_PROBLEM_DATA':
      return {
        ...state,
        lessonProblemData: action.payload,
      };
    case 'SET_CODE_STATE': // modified case to handle code state
      return {
        ...state,
        codeState: {
          ...state.codeState,
          ...action.payload,
        },
      };
    case 'SET_LESSON_TAB_INDEX':
      return {
        ...state,
        lessonTabIndex: action.payload,  // Update tabIndex with the new value
      };
    case 'SET_INPUT_OUTPUT_TAB':
      return {
        ...state,
        inputOutputTab: action.payload,  // Update tabIndex with the new value
      };
    case 'SET_INPUT_DATA':
      return {
        ...state,
        inputData: action.payload,  // Update tabIndex with the new value
      };
    case 'SET_OUTPUT_DATA':
      return {
        ...state,
        outputData: action.payload,  // Update tabIndex with the new value
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
