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
  authenticatedUser: null,
  fileTabs: [],
  activeFileTab: 0,
  fileCode: undefined,
  treeData: null,
  openFile: null,
  openTemplate: null,
  templateIsClicked: false,
  isFileListOpen: true,
  activeCategoryId: null,
  lessonQuestionList: null,
  userInfo: null,
  filesSectionOpen: true,
  templatesSectionOpen: true,
  allMetaData: null,
  runningAllCases: false,
  runningCustomCase: false,
  getCurrentCodeSignal: false,
  updateFileCodeSignal: false,
  loadedFirestoreCode: false,
  isFileSaved: undefined,
  loadedTreeData: false
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
    case 'ADD_FILE_TAB':
      return {
        ...state,
        fileTabs: [...state.fileTabs, action.payload],
      };
    case 'REMOVE_FILE_TAB_BY_ID':
      const removedById = state.fileTabs.filter(tab => tab.id !== action.payload);
      return {
        ...state,
        fileTabs: removedById,
      };
    case 'REMOVE_FILE_TAB_BY_INDEX':
      const removedByIndex = state.fileTabs.filter((_, i) => i !== action.payload);
      return {
        ...state,
        fileTabs: removedByIndex,
      };
    case 'SET_ACTIVE_FILE_TAB':
      return {
        ...state,
        activeFileTab: action.payload,
      }
    case 'SET_FILE_CODE':
      return {
        ...state,
        fileCode: action.payload,
      }
    case 'UPDATE_FILE_CODE':
      console.log('UPDATE_FILE_CODE', {
        ...state.fileCode,
        [action.key]: action.value,
      });
      return {
        ...state, 
        fileCode: {
          ...state.fileCode,
          [action.key]: action.value,
        }
      }
    case 'DELETE_FILE_CODE':
      console.log('DELETE_FILE_CODE', action.key);
      console.log("state.fileCode", state.fileCode);
      const newFileCodeState = { ...state.fileCode };
      delete newFileCodeState[action.key];
      console.log("newFileCodeState", newFileCodeState);
      return {
        ...state,
        fileCode: newFileCodeState
      };
    case 'REPLACE_FILE_CODE':
      return {
        ...state,
        fileCode: action.newState
      }
    case 'SET_TREE_DATA':
      return {
        ...state,
        treeData: action.payload
      }
    case 'SET_OPEN_FILE':
      return {
        ...state,
        openFile: action.payload
      }
    case 'SET_OPEN_TEMPLATE':
      return {
        ...state,
        openTemplate: action.payload
      }
    case 'SET_TEMPLATE_IS_CLICKED':
      return {
        ...state,
        templateIsClicked: action.payload
      }
    case 'SET_IS_FILE_LIST_OPEN':
      return {
        ...state, 
        isFileListOpen: action.payload
      }
    case 'SET_ACTIVE_CATEGORY_ID':
      return {
        ...state,
        activeCategoryId: action.payload
      }
    case 'SET_LESSON_QUESTION_LIST': {
      return {
        ...state,
        lessonQuestionList: action.payload
      }
    }
    case 'SET_USER_INFO': {
      return {
        ...state,
        userInfo: action.payload
      }
    }
    case 'TOGGLE_FILES_SECTION_OPEN': {
      return {
        ...state,
        filesSectionOpen: !state.filesSectionOpen
      }
    }
    case 'TOGGLE_TEMPLATES_SECTION_OPEN': {
      return {
        ...state,
        templatesSectionOpen: !state.templatesSectionOpen
      }
    }
    case 'SET_ALL_META_DATA': {
      return {
        ...state,
        allMetaData: action.payload
      }
    }
    case 'TOGGLE_RUNNING_ALL_CASES': {
      return {
        ...state,
        runningAllCases: !state.runningAllCases
      }
    }
    case 'TOGGLE_RUNNING_CUSTOM_CASE': {
      return {
        ...state,
        runningCustomCase: !state.runningCustomCase
      }
    }    
    case 'TOGGLE_GET_CODE_SIGNAL': {
      return {
        ...state,
        getCurrentCodeSignal: !state.getCurrentCodeSignal
      }
    }
    case 'TOGGLE_UPDATE_FILE_CODE_SIGNAL': {
      return {
        ...state,
        updateFileCodeSignal: !state.updateFileCodeSignal
      }
    }
    case 'LOADED_FIRESTORE_CODE': {
      return {
        ...state,
        loadedFirestoreCode: true
      }
    }
    case 'UPDATE_IS_FILE_SAVED':
      console.log('UPDATE_IS_FILE_SAVED');
      console.log({
        ...state.isFileSaved,
        [action.key]: action.payload,
      });
      return {
        ...state, 
        isFileSaved: {
          ...state.isFileSaved,
          [action.key]: action.payload,
        }
      }
    case 'DELETE_IS_FILE_SAVED':
      const newIsFileSaved = { ...state.isFileSaved };
      delete newIsFileSaved[action.key];
      return {
        ...state,
        isFileSaved: newIsFileSaved
      };
    case 'REPLACE_IS_FILE_SAVED':
      return {
        ...state,
        isFileSaved: action.payload
      }
    case 'LOADED_TREE_DATA':
      console.log('LOADED_TREE_DATA');
      return {
        ...state,
        loadedTreeData: true
      }
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
