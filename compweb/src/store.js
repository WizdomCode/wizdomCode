// store.js
import { createStore } from 'redux';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  tabs: [
    { type: 'newTab', data: null , id: uuidv4() },
  ],
  lessonTabs: [],
  lessonMetaData: [{
    unit: NaN,
    lesson: NaN,
    problem_id: '',
  }],
  lessonProblemData: [{
    contest: '',
    description: '',
    folder: '',
    inputFormat: '',
    outputFormat: '',
    points: NaN,
    title: '',
    topics: [],
  }],
  lessonActiveTab: { type: '', data: null },
  codeState: { // modified code state
    language: '',
    code: '',
  },
  lessonTabIndex: 0,
  inputOutputTab: 'input',
  inputData: '',
  outputData: '',
  authenticatedUser: null
};

initialState.currentTab = initialState.tabs[0];

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TAB':
      const newTab = { ...action.payload, id: uuidv4() };
      return {
        ...state,
        tabs: [...state.tabs, newTab],
        currentTab: newTab,
      };
    case 'ADD_LESSON_TAB':
      const newLessonTab = { ...action.payload, id: uuidv4() };
      return {
        ...state,
        lessonTabs: [...state.tabs, newLessonTab],
        lessonTab: newLessonTab,
      };
    case 'REMOVE_TAB':
      const newTabs = state.tabs.filter(tab => tab.id !== action.payload.id);
      let newCurrentTab = state.currentTab;
      if (state.currentTab.id === action.payload.id) {
        const index = state.tabs.findIndex(tab => tab.id === action.payload.id);
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
        lessonMetaData: state.lessonMetaData.map((item, index) => {
          if(index === action.index) {
            return { ...item, ...action.payload };
          }
          return item;
        }),
      };
    case 'SET_LESSON_PROBLEM_DATA':
      return {
        ...state,
        lessonProblemData: state.lessonProblemData.map((item, index) => {
          if(index === action.index) {
            return { ...item, ...action.payload };
          }
          return item;
        }),
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
    case 'UPDATE_ARRAY_SIZE':
      const newSize = action.payload;
      const defaultMetaData = {
        unit: NaN,
        lesson: NaN,
        problem_id: '',
      };
      const defaultProblemData = {
        contest: '',
        description: '',
        folder: '',
        inputFormat: '',
        outputFormat: '',
        points: NaN,
        title: '',
        topics: [],
      };
      while (state.lessonMetaData.length < newSize) {
        state.lessonMetaData.push(defaultMetaData);
      }
      while (state.lessonProblemData.length < newSize) {
        state.lessonProblemData.push(defaultProblemData);
      }
      return {
        ...state,
      };
    case 'MOVE_TAB':
      const { fromIndex, toIndex, direction } = action.payload;
      const tabsCopy = [...state.tabs];
      let afterMove = [...state.tabs];
      if (toIndex < fromIndex) {
        afterMove = tabsCopy.slice(0, direction === 'left' ? toIndex : toIndex + 1).concat([tabsCopy[fromIndex]], tabsCopy.slice(direction === 'left' ? toIndex : toIndex + 1, fromIndex), tabsCopy.slice(fromIndex + 1, ));
      }
      else if (toIndex > fromIndex) {
        afterMove = tabsCopy.slice(0, fromIndex).concat(tabsCopy.slice(fromIndex + 1, direction === 'left' ? toIndex : toIndex + 1), [tabsCopy[fromIndex]], tabsCopy.slice(direction === 'left' ? toIndex : toIndex + 1, ));
      }
      console.log(afterMove);
      return {
        ...state,
        tabs: afterMove,
      };  
    case 'SET_USER_DATA':
      return {
        ...state,
        authenticatedUser: action.payload,  // Update tabIndex with the new value
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
