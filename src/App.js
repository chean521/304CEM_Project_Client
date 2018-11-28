import React, { Component } from 'react';
import './App.css';
import Navbar from './component/navbar';
import Footer from './component/foot';
import { Switch, Route } from 'react-router-dom';
import Main from './component/Home';
import Activity from './component/Activity';
import VoteList from './component/VoteList';
import AdminMgr from './component/AdminMgr';
import Axios from 'axios';

class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    Axios.get('https://webapi-oscar-server.herokuapp.com/SessMgr', {
      withCredentials: true
    })
      .then(res => {})
      .catch(err => {});
  }

  render = () => {
    return (
      <div>
        <Navbar />
        <div>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/Activity" component={Activity} />
            <Route exact path="/VoteList" component={VoteList} />
            <Route exact path="/AdminMgr" component={AdminMgr} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  };
}

export default App;
