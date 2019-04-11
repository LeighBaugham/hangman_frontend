import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SignUp from './components/SignUp';

import { Route, Switch } from 'react-router-dom'


class App extends Component {

  state = {
    users: []
  }


  render() {
    return (
      <div className="App">
      <Switch>
        < Route path="/signup" component={SignUp} />
      </Switch>
      </div>
    );
  }
}

export default App;
