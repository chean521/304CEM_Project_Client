import React, { Component } from 'react';
import './VoteList.css';
import Axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import VoteModal from './VoteModal';
const moment = require('moment');

class VoteList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alertVisible: false,
      rawdata: []
    };
  }

  componentDidMount = () => {
    document.title = 'INTI Voting System - Make a Vote';

    this.GetVoteList();
  };

  GetVoteList = () => {
    this.Spinner_list.style.display = 'initial';
    Axios.get(
      'https://webapi-oscar-server.herokuapp.com/VoteResult/MakeVoteList'
    )
      .then(res => {
        if (res == null) {
          this.setState({ rawdata: [] });
        } else {
          this.setState({ rawdata: res.data });
        }

        console.log('[React Data Fetch] Data fetch successfully.');
        this.Spinner_list.style.display = 'none';
      })
      .catch(err => {
        console.log('[React Data Fetch] Data fetch failed. ', err);
        this.Spinner_list.style.display = 'none';
      });
  };

  formatUTCtoNormal = UTC_Date => {
    var cr_date = new Date(UTC_Date);

    return (
      cr_date.getFullYear() +
      '-' +
      (cr_date.getMonth() + 1) +
      '-' +
      cr_date.getDate()
    );
  };

  render = () => {
    var result = [];

    if (this.state.rawdata.length == 0) {
      result.push(
        <div className="card bg-danger text-white" key="0">
          <div className="card-body text-center">
            <span className="fas fa-exclamation-circle" />
            &nbsp;&nbsp;No available vote activity.
          </div>
        </div>
      );
    } else {
      var data_package = this.state.rawdata;

      var today = new Date();
      var day = today.getDate();
      var mon = today.getMonth() + 1;
      var yrs = today.getFullYear();

      if (day < 10) {
        day = '0' + day;
      }

      if (mon < 10) {
        mon = '0' + mon;
      }

      var format_today = yrs + '-' + mon + '-' + day;
      var Today_Date = moment(format_today, 'YYYY-MM-DD');

      for (var i = 0; i < data_package.length; i++) {
        var Start_Date = moment(data_package[i].begin_date, 'YYYY-MM-DD');
        var End_Date = moment(data_package[i].end_date, 'YYYY-MM-DD');

        if (Today_Date.diff(Start_Date, 'days') < 0) {
          result.push(
            <div
              className="card bg-warning text-white"
              key={data_package[i]._id}
            >
              <div className="card-header">
                <span className="fas fa-info-circle" />
                &nbsp;&nbsp;
                <label>
                  Status: <strong>Event Not Start,</strong> Event ID:
                  <strong>{data_package[i]._id}</strong>
                </label>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6">
                    <label>
                      Event Title:&nbsp;&nbsp;
                      <strong>{data_package[i].title}</strong>
                    </label>
                    <br />
                    <label>
                      Event Description:&nbsp;&nbsp;
                      <strong>{data_package[i].description}</strong>
                    </label>
                    <br />
                    <label>
                      Event Purpose:&nbsp;&nbsp;
                      <strong>{data_package[i].purpose}</strong>
                    </label>
                    <br />
                    <label>
                      Event Type:&nbsp;&nbsp;
                      <strong>
                        {data_package[i].type == 'major'
                          ? 'Major Event'
                          : 'Minor Event'}
                      </strong>
                    </label>
                    <br />
                  </div>
                  <div className="col-sm-6">
                    <label>
                      Event Created Date:&nbsp;&nbsp;
                      <strong>
                        {this.formatUTCtoNormal(data_package[i].created_date)}
                      </strong>
                    </label>
                    <br />
                    <label>
                      Start Date:&nbsp;&nbsp;
                      <strong>{data_package[i].begin_date}</strong>
                    </label>
                    <br />
                    <label>
                      End Date:&nbsp;&nbsp;
                      <strong>{data_package[i].end_date}</strong>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (Today_Date.diff(End_Date, 'days') > 0) {
          result.push(
            <div
              className="card bg-danger text-white"
              key={data_package[i]._id}
            >
              <div className="card-header">
                <span className="fas fa-info-circle" />
                &nbsp;&nbsp;
                <label>
                  Status: <strong>Event Ended</strong>, Event ID:{' '}
                  <strong>{data_package[i]._id}</strong>
                </label>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6">
                    <label>
                      Event Title:&nbsp;&nbsp;
                      <strong>{data_package[i].title}</strong>
                    </label>
                    <br />
                    <label>
                      Event Description:&nbsp;&nbsp;
                      <strong>{data_package[i].description}</strong>
                    </label>
                    <br />
                    <label>
                      Event Purpose:&nbsp;&nbsp;
                      <strong>{data_package[i].purpose}</strong>
                    </label>
                    <br />
                    <label>
                      Event Type:&nbsp;&nbsp;
                      <strong>
                        {data_package[i].type == 'major'
                          ? 'Major Event'
                          : 'Minor Event'}
                      </strong>
                    </label>
                    <br />
                  </div>
                  <div className="col-sm-6">
                    <label>
                      Event Created Date:&nbsp;&nbsp;
                      <strong>
                        {this.formatUTCtoNormal(data_package[i].created_date)}
                      </strong>
                    </label>
                    <br />
                    <label>
                      Start Date:&nbsp;&nbsp;
                      <strong>{data_package[i].begin_date}</strong>
                    </label>
                    <br />
                    <label>
                      End Date:&nbsp;&nbsp;
                      <strong>{data_package[i].end_date}</strong>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          result.push(
            <a
              href="#"
              key={data_package[i]._id}
              data-toggle="modal"
              data-target="#vote_modal"
              data-id={data_package[i]._id}
            >
              <div className="card bg-success text-white">
                <div className="card-header">
                  <span className="fas fa-info-circle" />
                  &nbsp;&nbsp;
                  <label>
                    Status: <strong>Event In Progress</strong>, Event ID:{' '}
                    <strong>{data_package[i]._id}</strong>
                  </label>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <label>
                        Event Title:&nbsp;&nbsp;
                        <strong>{data_package[i].title}</strong>
                      </label>
                      <br />
                      <label>
                        Event Description:&nbsp;&nbsp;
                        <strong>{data_package[i].description}</strong>
                      </label>
                      <br />
                      <label>
                        Event Purpose:&nbsp;&nbsp;
                        <strong>{data_package[i].purpose}</strong>
                      </label>
                      <br />
                      <label>
                        Event Type:&nbsp;&nbsp;
                        <strong>
                          {data_package[i].type == 'major'
                            ? 'Major Event'
                            : 'Minor Event'}
                        </strong>
                      </label>
                      <br />
                    </div>
                    <div className="col-sm-6">
                      <label>
                        Event Created Date:&nbsp;&nbsp;
                        <strong>
                          {this.formatUTCtoNormal(data_package[i].created_date)}
                        </strong>
                      </label>
                      <br />
                      <label>
                        Start Date:&nbsp;&nbsp;
                        <strong>{data_package[i].begin_date}</strong>
                      </label>
                      <br />
                      <label>
                        End Date:&nbsp;&nbsp;
                        <strong>{data_package[i].end_date}</strong>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          );
        }
      }
    }

    return (
      <div>
        <div className="jumbotron text-center" style={{ marginTop: 55 }}>
          <h2>Make A Vote</h2>
        </div>

        <div className="container-fluid list-container">
          {result.map((rd, index) => {
            return (
              <div key={index}>
                {rd}
                <br />
              </div>
            );
          })}
          <div
            className="overlay"
            id="overlay_mask"
            style={{ display: 'none' }}
            ref={spinner => (this.Spinner_list = spinner)}
          >
            <i className="fas fa-sync fa-spin spin-elems" />
          </div>
        </div>

        <VoteModal />
      </div>
    );
  };
}

export default VoteList;
