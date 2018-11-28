import React, { Component } from 'react';
import './AdminMgr.css';
import Axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import EvtForm from './NewEventForm';
import TicketForm from './GenerateTicket';
import TicketDistribution from './TicketDitribution';
import ViewEvent from './ViewEvent';
import $ from 'jquery';

class AdminMgr extends Component {
  int_count = null;

  constructor(prop) {
    super(prop);
    this.state = {
      _interface: 0,
      bkp_authentication: false
    };
  }

  componentDidMount = () => {
    document.title = 'INTI Voting System - Admin Manager';
    this.checkSession();
  };

  checkSession = () => {
    Axios.get('https://webapi-oscar-server.herokuapp.com/SessMgr/GetVal', {
      params: { SessKey: 'admin_isAuthenticated' },
      credentials: 'same-origin'
    })
      .then(res => {
        if (typeof res.data.data === 'undefined') {
          if (this.state.bkp_authentication == false) {
            this.setState({
              _interface: 0,
              bkp_authentication: this.state.bkp_authentication
            });
          } else {
            this.setState({
              _interface: 1,
              bkp_authentication: this.state.bkp_authentication
            });
          }
        } else {
          if (res.data.data == null) {
            this.setState({
              _interface: 0,
              bkp_authentication: this.state.bkp_authentication
            });
          } else {
            this.setState({
              _interface: 1,
              bkp_authentication: this.state.bkp_authentication
            });
          }
        }
      })
      .catch(err => {
        if (this.state.bkp_authentication == false) {
          this.setState({
            _interface: 0,
            bkp_authentication: this.state.bkp_authentication
          });
        } else {
          this.setState({
            _interface: 1,
            bkp_authentication: this.state.bkp_authentication
          });
        }
      });
  };

  ShowInputPassword = e => {
    this.PassInput.type = 'text';
  };

  HideInputPassword = e => {
    this.PassInput.type = 'password';
  };

  PasswordKeyPress = sender => {
    if (sender.which == 13) {
      this.Spinner.style.display = 'initial';
      Axios.get(
        'https://webapi-oscar-server.herokuapp.com/AdminMgr/ValidAdmin',
        {
          params: { Password: this.PassInput.value }
        }
      )
        .then(res => {
          if (res.data.res == false) {
            alert('Invalid admin password.');
            this.setState({
              _interface: this.state._interface,
              bkp_authentication: false
            });
          } else {
            Axios.get(
              'https://webapi-oscar-server.herokuapp.com/SessMgr/AddKey',
              {
                params: { SessKey: 'admin_isAuthenticated', SessVal: 'yes' },
                credentials: 'same-origin'
              }
            ).then(res => {
              this.checkSession();
            });
          }
          this.Spinner.style.display = 'none';
          this.setState({
            _interface: this.state._interface,
            bkp_authentication: true
          });
        })
        .catch(err => {
          alert('Invalid admin password.');
          this.Spinner.style.display = 'none';
          this.setState({
            _interface: this.state._interface,
            bkp_authentication: false
          });
        });
    }
  };

  AddNewEventClick = e => {
    $('#add_new_evt').modal('show');
  };

  LogOutClicked = e => {
    Axios.get('https://webapi-oscar-server.herokuapp.com/SessMgr/DelKey', {
      params: { SessKey: 'admin_isAuthenticated' },
      credentials: 'same-origin'
    }).then(res => {
      this.setState({
        _interface: this.state._interface,
        bkp_authentication: false
      });
      this.checkSession();
    });
  };

  render = () => {
    switch (this.state._interface) {
      case 1:
        return (
          <div>
            <div>
              <div
                className="card bg-primary col-sm-5 text-white mx-auto"
                style={{ marginTop: 100 }}
              >
                <div className="card-body text-center">
                  <h4 className="card-title">Admin Management Selection</h4>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={e => this.AddNewEventClick(e)}
                  >
                    Add New Event
                  </button>
                  <br />
                  <br />
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    data-toggle="modal"
                    data-target="#NewTicket"
                  >
                    Generate New Ticket
                  </button>
                  <br />
                  <br />
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    data-toggle="modal"
                    data-target="#ticket_dist"
                  >
                    View Ticket Distribution
                  </button>
                  <br />
                  <br />
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    data-toggle="modal"
                    data-target="#view_event"
                  >
                    View Voting Event
                  </button>
                  <br />
                  <br />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={e => this.LogOutClicked(e)}
                  >
                    Log Out
                  </button>
                </div>
              </div>
              <EvtForm />
              <TicketForm />
              <TicketDistribution />
              <ViewEvent />
            </div>
          </div>
        );
        break;

      default:
      case 0:
        return (
          <div>
            <div
              className="card bg-primary col-sm-5 text-white mx-auto"
              style={{ marginTop: 100 }}
            >
              <div className="card-body text-center">
                <h4 className="card-title">
                  Please input password to continue
                </h4>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-key" />
                    </span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    maxLength="30"
                    ref={input => (this.PassInput = input)}
                    onKeyPress={e => this.PasswordKeyPress(e)}
                  />
                  <div className="input-group-append">
                    <span
                      className="input-group-text"
                      onMouseOver={e => this.ShowInputPassword(e)}
                      onMouseOut={e => this.HideInputPassword(e)}
                    >
                      <i className="fas fa-eye" />
                    </span>
                  </div>
                </div>
                <i style={{ fontSize: 13 }}>
                  Please press enter after input password.
                </i>
              </div>

              <div
                className="overlay"
                id="overlay_mask"
                style={{ display: 'none', zIndex: 9999 }}
                ref={spinner => (this.Spinner = spinner)}
              >
                <i className="fas fa-sync fa-spin spin-elems" />
              </div>
            </div>
          </div>
        );
        break;
    }
  };
}

export default AdminMgr;
