import React, { Component } from 'react';
import './Home.css';
import Maps from './googlemap';

class Home extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    document.title = 'INTI Voting System - Home';
  };

  render = () => {
    return (
      <div style={{ marginTop: 55 }}>
        <div className="container-fluid text-center" id="container-1">
          <div className="row">
            <div className="col-lg-12" style={{ height: 700 }}>
              <h2 id="cont-1-text">Welcome to Web Based Voting System</h2>
              <p id="cont-desc-1">Are you voted your candidate?</p>
            </div>
          </div>
        </div>
        <div className="container-fluid text-center" id="container-2">
          <div className="row">
            <div className="col-lg-12" style={{ height: 700 }}>
              <h2 id="cont-2-text">About System</h2>
              <p id="cont-desc-2">
                Our system is designed to let voters make vote easily. This
                system contains vote panel, result panel and etc.
              </p>
            </div>
          </div>
        </div>
        <div className="container-fluid text-center" id="container-3">
          <div className="row">
            <div className="col-lg-12" style={{ height: 700 }}>
              <h2 id="cont-3-text">Contact Us</h2>
              <div className="container">
                <div className="row" style={{ marginTop: 10 }}>
                  <div className="col-md-6 text-right" id="cont-desc-3">
                    Author Name
                  </div>
                  <div className="col-md-6 text-left" id="cont-desc-3">
                    Oscar Loh
                  </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                  <div className="col-md-6 text-right" id="cont-desc-3">
                    E-Mail
                  </div>
                  <div className="col-md-6 text-left" id="cont-desc-3">
                    <a href="mailto:aabbcc@gmail.com">aabbcc@gmail.com</a>
                  </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                  <div className="col-md-6 text-right" id="cont-desc-3">
                    Contact No
                  </div>
                  <div className="col-md-6 text-left" id="cont-desc-3">
                    +6 04 - 611 6111
                  </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                  <div className="col-md-6 text-right" id="cont-desc-3">
                    Location
                  </div>
                  <div className="col-md-6 text-left" id="cont-desc-3">
                    <a href="#googleMap">(5.341791,100.282081)</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Maps />
        </div>
      </div>
    );
  };
}

export default Home;
