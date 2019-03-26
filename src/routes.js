import React from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import DisplayImage from './components/DisplayImage';

class Routes extends React.Component {
    render() {
      return (
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/displayimage' component={DisplayImage} />
  
          <Route render = { function() {
          return <h1>Not Found</h1>;
           }} />
        </Switch>
    );
  }
  }
  export default Routes;
  