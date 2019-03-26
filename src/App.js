import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
// import Posts from './components/Post';
// import PostForm from './components/Postform';
import FileUpload from './components/FileUpload'
import store from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
          <div className="App">
            {/* <PostForm /> */}
            <FileUpload />
            <hr />
            {/* <Posts /> */}
          </div>
      </Provider>
    );
  }
}

export default App;
