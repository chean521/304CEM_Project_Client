import React, { Component } from 'react';
import './Activity.css';
import Axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import $ from 'jquery';
const moment = require('moment');
var Chart = require('chart.js');

class Activity extends Component {
  constructor() {
    super();
    this.state = {
      list_data: [],
      event_select: null,
      details_content: ''
    };

    this.p_chart = null;
  }

  componentDidMount = () => {
    document.title = 'INTI Voting System  - Activity Status';
    this.ListAvailableVote();
  };

  ListAvailableVote = () => {
    this.Spinner_list.style.display = 'initial';
    Axios.get(
      'https://webapi-oscar-server.herokuapp.com/VoteResult/MakeVoteList'
    )
      .then(res => {
        var raw = res.data;
        var tmp = [];

        for (var i = 0; i < raw.length; i++) {
          tmp.push({
            pid: raw[i]._id,
            title: raw[i].title,
            created_date: raw[i].created_date
          });
        }

        this.setState({ list_data: tmp });
        this.Spinner_list.style.display = 'none';
      })
      .catch(err => {
        console.log('[React Data Fetch] Unable to get results');
        this.Spinner_list.style.display = 'none';
      });
  };

  ListSelectedDetails = (sender, id) => {
    this.Spinner.style.display = 'initial';

    $.ajax({
      dataType: 'json',
      method: 'GET',
      async: true,
      data: {
        EventKey: id
      },
      url: 'https://webapi-oscar-server.herokuapp.com/VoteResult/EventDetails',
      statusCode: {
        304: e => {
          this.DataGetResp(e);
          this.Spinner.style.display = 'none';
        },
        200: c => {
          this.DataGetResp(c);
          this.Spinner.style.display = 'none';
        }
      }
    });
  };

  DataGetResp = e => {
    var candidate_data = e.Candidate_Data;
    var vote_data = e.Vote_Data;
    var event_data = e.Event_Data[0];

    var labels = [];
    var rg = [];

    for (var i = 0; i < candidate_data.length; i++) {
      labels.push(candidate_data[i].candidate_name);
    }

    for (var j = 0; j < vote_data.candidate_data.length; j++) {
      for (var parser = 0; parser < labels.length; parser++) {
        if (
          vote_data.candidate_data[parser].cand_ind ==
          candidate_data[j].candidate_index
        ) {
          rg.push(vote_data.candidate_data[parser].voted);
        }
      }
    }

    var chart_title =
      'Vote Event - ' +
      event_data.title +
      ' (Created Date: ' +
      this.formatUTCtoNormal(event_data.created_date) +
      ')';

    this.addChartData(labels, rg, chart_title);

    var Evt_Title = [
      'Event Status',
      'Event ID',
      'Event Title',
      'Event Description',
      'Purpose',
      'Event Type',
      'Created Date',
      'Start Date',
      'End Date',
      'Remarks'
    ];

    var cand_ttl = [
      'Candidate Vote Index',
      'Current Age',
      'School',
      'Program',
      'Semester',
      'Current CGPA'
    ];

    var cand_det_rearranged = [];

    for (var i = 0; i < candidate_data.length; i++) {
      cand_det_rearranged.push([
        candidate_data[i].candidate_name,
        this.jsUcfirst(candidate_data[i].candidate_index),
        candidate_data[i].age,
        candidate_data[i].school.toUpperCase(),
        candidate_data[i].programme.toUpperCase(),
        candidate_data[i].semester,
        candidate_data[i].current_cgpa
      ]);
    }

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
    var Start_Date = moment(event_data.begin_date, 'YYYY-MM-DD');
    var End_Date = moment(event_data.end_date, 'YYYY-MM-DD');

    var evt_status = '';

    if (Today_Date.diff(Start_Date, 'days') < 0) evt_status = 'Not Start';
    else if (Today_Date.diff(End_Date, 'days') > 0) evt_status = 'Ended';
    else evt_status = 'In progress';

    var Evt_Det = [
      evt_status,
      event_data._id,
      event_data.title,
      event_data.description,
      event_data.purpose,
      this.jsUcfirst(event_data.type),
      this.formatUTCtoNormal(event_data.created_date),
      event_data.begin_date,
      event_data.end_date,
      event_data.remark
    ];

    var leaders = this.ManipulateLeading(vote_data.candidate_data);
    var leader_name = null;
    var candidate_profiles = [];

    for (var i = 0; i < candidate_data.length; i++) {
      if (candidate_data[i].candidate_index === leaders.cand_ind) {
        leader_name = candidate_data[i].candidate_name;
        break;
      }
    }

    for (var i = 0; i < vote_data.candidate_data.length; i++) {
      var tmp = [];
      var names = null;

      for (var j = 0; j < candidate_data.length; j++) {
        if (
          vote_data.candidate_data[i].cand_ind ===
          candidate_data[j].candidate_index
        ) {
          names = candidate_data[j].candidate_name;
          break;
        }
      }

      var curr_vote = vote_data.candidate_data[i].voted;
      var ttl_vote = vote_data.total_voters;
      var diff_vote = (curr_vote / ttl_vote) * 100;

      tmp.push(
        <div className="row" key={i}>
          <div className="col-sm-6">{names}</div>
          <div className="col-sm-3">{curr_vote} vote(s)</div>
          <div className="col-sm-3">{diff_vote.toFixed(2)} %</div>
        </div>
      );

      candidate_profiles.push(tmp);
    }

    var Stats_Title = [
      'Current Leading',
      'Total Voters Participated',
      'Total Voters Voted',
      "Total Voters Haven't Vote",
      'Each Candidate Statistic'
    ];

    var Stats_Res = [
      leader_name,
      vote_data.total_voters + ' voter(s) total',
      vote_data.total_voted + ' voter(s) voted',
      vote_data.total_unvote + ' voter(s) not vote',
      candidate_profiles
    ];

    this.setState({
      details_content: (
        <div style={{ marginTop: 30 }}>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active" data-toggle="tab" href="#evt_inf">
                <i className="fas fa-calendar-alt" />
                &nbsp;&nbsp;Event Information
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#cand_inf">
                <i className="fas fa-poll" />
                &nbsp;&nbsp;Candidate Information
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#statistic">
                <i className="fas fa-chart-pie" />
                &nbsp;&nbsp;Statistic
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className="tab-pane container active"
              id="evt_inf"
              style={{ paddingLeft: 0, paddingRight: 0 }}
            >
              <div className="table-responsive">
                <table
                  ref={tb_evt => (this.Table_Event = tb_evt)}
                  className="table"
                >
                  <thead className="thead-dark">
                    <tr>
                      <th>Request</th>
                      <th>Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Evt_Title.map((val, ind) => {
                      return (
                        <tr key={ind}>
                          <td>{val}</td>
                          <td>{Evt_Det[ind]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="tab-pane container fade"
              id="cand_inf"
              style={{ paddingLeft: 0, paddingRight: 0 }}
            >
              <div className="table-responsive">
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th>Candidate</th>
                      <th>Information</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cand_det_rearranged.map((val, ind) => {
                      return (
                        <tr key={ind}>
                          <td>
                            <strong>{val[0]}</strong>
                          </td>
                          <td>
                            {cand_ttl.map((vals, index) => {
                              return (
                                <div className="row" key={index}>
                                  <div className="col-sm-5">{vals}</div>
                                  <div className="col-sm-7">
                                    <strong>{val[index + 1]}</strong>
                                  </div>
                                </div>
                              );
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="tab-pane container fade"
              id="statistic"
              style={{ paddingLeft: 0, paddingRight: 0 }}
            >
              <div className="table-responsive">
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th>Category</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Stats_Title.map((val, ind) => {
                      return (
                        <tr key={ind}>
                          <td>{val}</td>
                          <td>{Stats_Res[ind]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
    });
  };

  addChartData = (name, datas, rootlabel) => {
    if (this.p_chart !== null) {
      this.p_chart.destroy();
    }

    Chart.plugins.register({
      afterDatasetsDraw: function(chart) {
        var ctx = chart.ctx;

        chart.data.datasets.forEach(function(dataset, i) {
          var meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function(element, index) {
              // Draw the text in black, with the specified font
              ctx.fillStyle = 'rgb(255, 255, 255)';

              var fontSize = 12;
              var fontStyle = 'normal';
              var fontFamily = 'Helvetica Neue';
              ctx.font = Chart.helpers.fontString(
                fontSize,
                fontStyle,
                fontFamily
              );

              // Just naively convert to string for now
              var dataString = dataset.data[index].toString() + ' vote(s)';

              // Make sure alignment settings are correct
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              var padding = 5;
              var position = element.tooltipPosition();
              ctx.fillText(
                dataString,
                position.x,
                position.y - fontSize / 2 - padding
              );
            });
          }
        });
      }
    });

    var color_set = [];
    var border_set = [];

    for (var i = 0; i < datas.length; i++) {
      var colors = this.AutoHexColorGenerator();

      var txt_color =
        'rgba(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ', 0.5)';
      var border_color =
        'rgba(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ', 1)';

      color_set.push(txt_color);
      border_set.push(border_color);
    }

    var total_vote = 0;

    for (var i = 0; i < datas.length; i++) {
      total_vote += datas[i];
    }

    this.p_chart = new Chart(this.PieChart, {
      type: 'doughnut',
      data: {
        labels: name,
        datasets: [
          {
            label: '# of Votes',
            data: datas,
            backgroundColor: color_set,
            borderColor: border_set
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: rootlabel,
          fontColor: 'white',
          fontSize: 15
        },
        legend: {
          display: true,
          labels: {
            fontColor: 'white'
          }
        },
        tooltips: {
          enabled: true,
          mode: 'index',
          footerFontStyle: 'normal',
          callbacks: {
            label: (ttl_item, data) => {
              return 'Candidate: ' + data.labels[ttl_item.index];
            },
            afterLabel: (ttl_item, data) => {
              var ttl_each_vote = data.datasets[0].data[ttl_item.index];
              return 'Total Votes: ' + ttl_each_vote + ' vote(s)';
            },
            footer: (ttl_item, data) => {
              var curr_vote = data.datasets[0].data[ttl_item[0].index];
              var percent = (curr_vote / total_vote) * 100;
              return 'Leading Percentage: ' + percent.toFixed(2) + ' %';
            }
          }
        }
      }
    });
  };

  SearchInputKeyPressed = sender => {
    if (sender.which === 13 && this.SearchBox.value.length == 24) {
      this.Spinner_list.style.display = 'initial';
      Axios.get(
        'https://webapi-oscar-server.herokuapp.com/VoteResult/VoteListInDetails',
        {
          params: {
            EventKey: this.SearchBox.value
          }
        }
      )
        .then(res => {
          this.SearchBox.blur();
          var raw = res.data;

          this.ProcessSearch(raw);
        })
        .catch(err => {
          this.Spinner_list.style.display = 'none';
        });
    } else if (sender.which === 13 && this.SearchBox.value.length !== 24) {
      alert('Invalid event key input, please input 24 HEX ID');
    }
  };

  ManipulateLeading = vote_data => {
    var leader = { cand_ind: null, voted: 0 };

    for (var i = 0; i < vote_data.length; i++) {
      if (vote_data[i].voted >= leader.voted) {
        leader.cand_ind = vote_data[i].cand_ind;
        leader.voted = vote_data[i].voted;
      }
    }

    return leader;
  };

  DateSearchClicked = e => {
    var Starts = this.CrDate_From.value;
    var Ends = this.CrDate_To.value;

    if (Starts === '' || Ends === '') {
      alert('Error Search By Date: Please enter proper date range.');
    } else {
      var Compare_Start = moment(Starts, 'YYYY-MM-DD');
      var Compare_End = moment(Ends, 'YYYY-MM-DD');

      if (Compare_Start.diff(Compare_End, 'days') > 0) {
        alert(
          'Error Search By Date: End range should be larger than start range.'
        );
      } else {
        this.Spinner_list.style.display = 'initial';
        Axios.get(
          'https://webapi-oscar-server.herokuapp.com/VoteResult/VoteListInDateRange',
          {
            params: {
              StartDate: Starts,
              EndDate: Ends
            }
          }
        )
          .then(res => {
            var raw = res.data;

            this.ProcessSearch(raw);
          })
          .catch(err => {
            this.Spinner_list.style.display = 'none';
          });
      }
    }
  };

  ProcessSearch = raw => {
    var tmp = [];
    if (raw.length <= 0) {
      this.setState({ list_data: [] });
      this.Spinner_list.style.display = 'none';
    } else {
      for (var i = 0; i < raw.length; i++) {
        tmp.push({
          pid: raw[i]._id,
          title: raw[i].title,
          created_date: this.formatUTCtoNormal(raw[i].created_date)
        });
      }

      this.setState({ list_data: tmp });
      this.Spinner_list.style.display = 'none';
    }
  };

  EventTypeSelected = e => {
    this.Spinner_list.style.display = 'initial';
    Axios.get(
      'https://webapi-oscar-server.herokuapp.com/VoteResult/VoteListInEvtType',
      {
        params: {
          EventType: this.Evt_Type.value
        }
      }
    )
      .then(res => {
        var raw = res.data;

        this.ProcessSearch(raw);
      })
      .catch(err => {
        this.Spinner_list.style.display = 'none';
      });
  };

  AutoHexColorGenerator = () => {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    return [red, green, blue];
  };

  jsUcfirst = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  refreshMouseOut = e => {
    this.SyncAnchor.classList.remove('fa-spin');
  };

  refreshMouseIn = e => {
    this.SyncAnchor.classList.add('fa-spin');
  };

  refreshMouseClicked = e => {
    this.ListAvailableVote();
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
    return (
      <div style={{ marginTop: 55 }}>
        <div className="jumbotron text-center" id="container-4">
          <h2>Check Activity Status</h2>
        </div>
        <div className="card-deck" style={{ marginLeft: 0, marginRight: 0 }}>
          <div className="col-sm-5">
            <div className="card bg-primary text-white" style={{ height: 650 }}>
              <div className="card-header">
                <h6 className="card-title">
                  <i className="fas fa-clipboard-list" />
                  &nbsp;&nbsp;Available Event
                  <div className="float-sm-right">
                    <input
                      type="text"
                      placeholder="Event ID"
                      className="Search_Input"
                      ref={input => (this.SearchBox = input)}
                      onKeyPress={e => this.SearchInputKeyPressed(e)}
                    />
                    &nbsp;&nbsp;
                    <a
                      ref={sync => (this.SyncAnchor = sync)}
                      className="fas fa-sync"
                      style={{ cursor: 'pointer' }}
                      onMouseOut={e => this.refreshMouseOut(e)}
                      onMouseOver={e => this.refreshMouseIn(e)}
                      onClick={e => this.refreshMouseClicked(e)}
                      data-toggle="tooltip"
                      title="Reload all the result without advanced search."
                    />
                  </div>
                </h6>
              </div>
              <div className="card-body" style={{ overflowY: 'scroll' }}>
                <div className="list-group">
                  {this.state.list_data.length <= 0 ? (
                    <a
                      href="#"
                      className="list-group-item list-group-item-action list-group-item-danger"
                      key="0"
                    >
                      <span className="fas fa-exclamation-circle" />
                      &nbsp;&nbsp; No Event Available
                    </a>
                  ) : (
                    this.state.list_data.map((data, index) => {
                      return (
                        <a
                          href="#"
                          className="list-group-item list-group-item-action"
                          key={data.pid}
                          onClick={e => this.ListSelectedDetails(e, data.pid)}
                        >
                          Event ID: {data.pid}, Title: {data.title}, Created
                          Date: {this.formatUTCtoNormal(data.created_date)}
                        </a>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="card-footer" id="foots">
                <h6>
                  <i className="fas fa-search" />
                  &nbsp;&nbsp;Advanced Search
                  <div className="float-sm-right">
                    <a
                      href="#coll_advs"
                      className="togg-icon collapsed"
                      data-toggle="collapse"
                    >
                      <span className="fas fa-chevron-down rotate-fa" />
                    </a>
                  </div>
                </h6>
                <div id="coll_advs" className="collapse" data-parent="#foots">
                  <br />
                  <div className="row">
                    <div className="col-sm-6">
                      <h6 style={{ fontSize: 14 }}>Search By Created Date</h6>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Range From</span>
                        </div>
                        <input
                          type="date"
                          className="form-control"
                          ref={CrDate => (this.CrDate_From = CrDate)}
                        />
                      </div>
                      <br />
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Range To</span>
                        </div>
                        <input
                          type="date"
                          className="form-control"
                          ref={CrDate => (this.CrDate_To = CrDate)}
                        />
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={e => this.DateSearchClicked(e)}
                          >
                            <i className="fas fa-play" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <h6 style={{ fontSize: 14 }}>Search By Event Type</h6>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Event Type</span>
                        </div>
                        <select
                          className="form-control"
                          ref={evt_type => (this.Evt_Type = evt_type)}
                          onChange={e => this.EventTypeSelected(e)}
                        >
                          <option defaultValue value="major">
                            Major Event
                          </option>
                          <option value="minor">Minor Event</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="overlay"
                id="overlay_mask"
                style={{ display: 'none' }}
                ref={spinner => (this.Spinner_list = spinner)}
              >
                <i className="fas fa-sync fa-spin spin-elems" />
              </div>
            </div>
          </div>
          <div className="col-sm-7">
            <div className="card bg-info text-white" style={{ height: 650 }}>
              <div className="card-header">
                <h6 className="card-title">
                  <i className="fab fa-elementor" />
                  &nbsp;&nbsp;View Event
                </h6>
              </div>
              <div className="card-body" style={{ overflowY: 'scroll' }}>
                <canvas
                  style={{ width: 200, height: 100 }}
                  ref={canvas => (this.PieChart = canvas)}
                />
                {this.state.details_content}
              </div>
              <div
                className="overlay"
                id="overlay_mask"
                style={{ display: 'none' }}
                ref={spinner => (this.Spinner = spinner)}
              >
                <i className="fas fa-sync fa-spin spin-elems" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default Activity;
