import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  render = () => {
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-warning fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link to="#" className="navbar-brand">
                INTI Voting System
              </Link>
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#menu_collp"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse mr-auto" id="menu_collp">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/#container-1" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/#container-2" className="nav-link">
                    About System
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/#container-3" className="nav-link">
                    Contact Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Activity" className="nav-link">
                    Activity Status
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/VoteList" className="nav-link">
                    Make a Vote
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/AdminMgr" className="nav-link">
                    Admin Management
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  };
}

export default Navbar;
