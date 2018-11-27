import React, { Component } from 'react';
import './NewEventForm.css';
import Axios from 'axios';
import $ from 'jquery';
import '@fortawesome/fontawesome-free/css/all.css';
import PopUpInf from './PopCandInf';

class EventForm extends Component {
  constructor() {
    super();
    this.state = {
      CandidateInputCount: 0,
      CandidateList: []
    };
  }

  componentDidMount = () => {
    $(this.modal).on('show.bs.modal', this.HandleModalOpen);
    $(this.modal).on('hidden.bs.modal', this.HandleModalClose);
  };

  HandleModalClose = sender => {
    $(this.modal).modal('hide');
    this.MainForm.reset();
    this.setState({ CandidateList: [], CandidateInputCount: 0 });
  };

  HandleModalOpen = sender => {};

  HandleNewCandidate = sender => {
    var CurrList = this.state.CandidateList;
    var CurrCount = this.state.CandidateInputCount + 1;

    var NowList = {
      pid: null,
      cand_name: sender.cand_name,
      cand_age: sender.cand_age,
      prog: sender.prog,
      skul: sender.skul,
      sem: sender.sem,
      cgpa: sender.cgpa
    };

    if (CurrCount == 0) {
      NowList.pid = this.IDGenerator();
    }

    for (var i = 0; i < CurrList.length; i++) {
      var tmp = this.IDGenerator();
      var duplicated = false;

      for (var j = 0; j < CurrList.length; j++) {
        if (tmp == CurrList[j].pid) {
          duplicated = true;
          break;
        }
      }

      if (duplicated == false) {
        NowList.pid = tmp;
        break;
      }
    }

    CurrList.push(NowList);

    this.setState({
      CandidateInputCount: CurrCount,
      CandidateList: CurrList
    });
  };

  AddEventClicked = sender => {
    var EventData = {
      title: this.EventTitle.value,
      description: this.EventDesc.value,
      purpose: this.Event_Purpose.value,
      type: this.Event_Type.value,
      begin_date: this.Date_Start.value,
      end_date: this.Date_End.value,
      remark: this.Remarks.value
    };

    var isEmpty = false;

    for (var key in EventData) {
      if (EventData[key] === '') {
        isEmpty = true;
        break;
      }
    }

    if (isEmpty == true) {
      alert('Invalid input, please input again.');
    } else {
      if (this.state.CandidateInputCount < 2) {
        alert('Minimum candidate must be 2 persons.');
      } else {
        if (window.confirm('Are you sure want to add new event?') == false)
          return;

        this.Spinner_list.style.display = 'initial';
        var NewCandSeq = [];
        var Cand_Data = this.state.CandidateList;

        for (var i = 0; i < Cand_Data.length; i++) {
          var Cand_Index = 'p' + (i + 1);
          var Seq = {
            candidate_index: Cand_Index,
            candidate_name: Cand_Data[i].cand_name,
            age: Cand_Data[i].cand_age,
            programme: Cand_Data[i].prog,
            school: Cand_Data[i].prog,
            semester: Cand_Data[i].sem,
            current_cgpa: Cand_Data[i].cgpa
          };

          NewCandSeq.push(Seq);
        }

        $.ajax({
          dataType: 'json',
          method: 'POST',
          url: 'https://webapi-oscar-server.herokuapp.com/AdminMgr/SaveEvent',
          async: true,
          data: JSON.stringify({
            EventData: EventData,
            CandidateData: NewCandSeq
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: {
            304: r => {
              if (r.result == true) {
                alert('Event Added.');
              } else {
                alert('Event not Added.');
              }

              this.Spinner_list.style.display = 'none';
              $(this.modal).modal('hide');
            },
            200: e => {
              if (e.result == true) {
                alert('Event Added.');
              } else {
                alert('Event not Added.');
              }

              this.Spinner_list.style.display = 'none';
              $(this.modal).modal('hide');
            }
          }
        });
      }
    }
  };

  DeleteCandidate = SelectID => {
    var pos = 0;
    var CurrList = this.state.CandidateList;
    var CurrCount = this.state.CandidateInputCount - 1;

    for (var i = 0; i < CurrList.length; i++) {
      if (CurrList[i].pid == SelectID) {
        pos = i;
        break;
      }
    }

    CurrList.splice(pos, 1);

    this.setState({
      CandidateInputCount: CurrCount,
      CandidateList: CurrList
    });
  };

  IDGenerator = () => {
    return Math.floor(Math.random() * 100 + 1);
  };

  OpenAddCand = sender => {
    if (this.state.CandidateInputCount >= 10) {
      alert('ERROR: Maximum candidate reached.');
    } else {
      $('#add_cand_modal').modal('show');
    }
  };

  render = () => {
    return (
      <div>
        <div
          className="modal fade"
          id="add_new_evt"
          role="modal"
          data-backdrop="static"
          data-keyboard="false"
          ref={modal => (this.modal = modal)}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-warning text-white">
              <div className="modal-header">
                <h4 className="modal-title">Add New Event</h4>
              </div>
              <div
                className="modal-body"
                style={{ height: 700, maxHeight: 700, overflowY: 'scroll' }}
              >
                <form
                  method="post"
                  ref={main_form => (this.MainForm = main_form)}
                >
                  <div className="form-group">
                    <label htmlFor="event_title" className="control-label">
                      Event title
                    </label>
                    <input
                      type="text"
                      maxLength="50"
                      className="form-control"
                      placeholder="Title for this event"
                      ref={ttl => (this.EventTitle = ttl)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event_desc" className="control-label">
                      Event description
                    </label>
                    <input
                      type="text"
                      maxLength="150"
                      className="form-control"
                      placeholder="Description for this event"
                      ref={desc => (this.EventDesc = desc)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event_purpose" className="control-label">
                      Purpose for Voting
                    </label>
                    <input
                      type="text"
                      maxLength="150"
                      className="form-control"
                      placeholder="Why need create this event?"
                      ref={purpose => (this.Event_Purpose = purpose)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event_type" className="control-label">
                      Event Type
                    </label>
                    <select
                      className="form-control"
                      ref={type => (this.Event_Type = type)}
                    >
                      <option value="major">Major Event</option>
                      <option value="minor">Minor Event</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="event_start" className="control-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      ref={start => (this.Date_Start = start)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event_end" className="control-label">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      ref={end => (this.Date_End = end)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event_remark" className="control-label">
                      Remarks
                    </label>
                    <textarea
                      className="form-control"
                      rows="6"
                      placeholder="What you want to add on record?"
                      ref={remark => (this.Remarks = remark)}
                    />
                  </div>
                </form>
                <div
                  className="card bg-info text-white"
                  style={{ height: 300 }}
                >
                  <div className="card-header">
                    <h6 className="card-title">
                      Candidate List
                      <div className="float-sm-right">
                        <i>Current: {this.state.CandidateInputCount}</i>
                        &nbsp;&nbsp;
                        <i>Min: 2</i>&nbsp;&nbsp;
                        <i>Max: 10</i>&nbsp;&nbsp;
                        <a
                          href="#"
                          className="text-warning"
                          style={{ textDecorationLine: 'none' }}
                          ref={btn_can_add => (this.Btn_Cand_Add = btn_can_add)}
                          onClick={e => this.OpenAddCand(e)}
                        >
                          <i className="fas fa-plus" />
                          &nbsp;Candidate
                        </a>
                      </div>
                    </h6>
                  </div>
                  <div className="card-body" style={{ overflowY: 'scroll' }}>
                    <ul className="list-group">
                      {this.state.CandidateList.map((val, ind) => {
                        if (ind % 2 == 0) {
                          return (
                            <li
                              className="list-group-item list-group-item-info d-flex align-items-center"
                              key={val.pid}
                            >
                              Candidate Name:&nbsp;
                              <strong>{val.cand_name}</strong>,&nbsp;
                              Program:&nbsp;<strong>{val.prog}</strong>,&nbsp;
                              Current CGPA:&nbsp;
                              <strong>{val.cgpa}</strong>
                              <a
                                href="#"
                                className="badge badge-danger badge-pill ml-auto"
                                onClick={e => this.DeleteCandidate(val.pid)}
                              >
                                <i className="fas fa-minus" />
                              </a>
                            </li>
                          );
                        } else {
                          return (
                            <li
                              className="list-group-item list-group-item-primary d-flex align-items-center"
                              key={val.pid}
                            >
                              Candidate Name:&nbsp;
                              <strong>{val.cand_name}</strong>,&nbsp;
                              Program:&nbsp;
                              <strong>{val.prog}</strong>,&nbsp; Current
                              CGPA:&nbsp;<strong>{val.cgpa}</strong>
                              <a
                                href="#"
                                className="badge badge-danger badge-pill ml-auto"
                                onClick={e => this.DeleteCandidate(val.pid)}
                              >
                                <i className="fas fa-minus" />
                              </a>
                            </li>
                          );
                        }
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={e => this.AddEventClicked(e)}
                >
                  Add New Event
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  data-dismiss="modal"
                >
                  Close
                </button>
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
        </div>
        <PopUpInf onCandidateAdded={this.HandleNewCandidate} />
      </div>
    );
  };
}

export default EventForm;
