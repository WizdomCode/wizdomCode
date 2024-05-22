import * as React from 'react';
import * as monaco from 'monaco-editor';
import styles from './Editor.module.css';

const editorStates = new Map();

export default class MonacoEditor extends React.Component {
  _node = React.createRef();
  _models = {};

  createModals(fileTabs, fileCode, treeData) {
    treeData.forEach(file => {
        if (!file.droppable) {
            this._models[file.id] = monaco.editor.createModel(fileCode[file.id], file.data.language, new monaco.Uri().with({ path: file.id }));
        }
    });
  }

  componentDidMount() {

    const { fileTabs, fileCode, treeData, path, value, language, onValueChange, ...options } = this.props;

    this.createModals(fileTabs, fileCode, treeData);

    this._editor = monaco.editor.create(this._node.current, {
      ...options,
      automaticLayout: true,
      fontSize: 18
    });

    this._editor.setModel(this._models[path]);

    // Not sure if these lines should reference the editor or the model
    this._subscription = this._models[path].onDidChangeContent(() => {
        this.props.onValueChange(this._models[path].getValue());
    });

    // Fetch and set the theme
    fetch('/themes/Night Owl Custom.json')
      .then(data => data.json())
      .then(data => {
        monaco.editor.defineTheme('night-owl', data);
        this._editor.updateOptions({ theme: 'night-owl' });
      });
  }

  componentDidUpdate(prevProps) {

    const { fileTabs, fileCode, treeData, path, value, language, onValueChange, ...options } = this.props;

    if (prevProps.treeData && treeData && prevProps.treeData !== treeData && treeData.length > prevProps.treeData.length) {
      const newFile = treeData.filter(obj2 => !prevProps.treeData.some(obj1 => JSON.stringify(obj1) === JSON.stringify(obj2)))[0];
      if (!newFile.droppable) {
          this._models[newFile.id] = monaco.editor.createModel(fileCode[newFile.id], newFile.data.language, new monaco.Uri().with({ path: newFile.id }));
      }
    }

    this._editor.updateOptions(options);
  
    if (prevProps.path !== path) {
        editorStates.set(path, this._editor.saveViewState());

        this._editor.setModel(this._models[path]);
    }  
  
    if (value !== this._editor.getModel().getValue()) {
        this._editor.getModel().pushEditOperations(
        [],
        [
          {
            range: this._editor.getModel().getFullModelRange(),
            text: value,
          },
        ]
      );
    }
  }

  componentWillUnmount() {

    Object.values(this._models).forEach(model => model.dispose());
    this._editor && this._editor.dispose();
    this._subscription && this._subscription.dispose();
  }

  render() {
    return <div className={styles.Editor} ref={this._node} style={{ width: '100%', height: '100%' }} />
  }
}
