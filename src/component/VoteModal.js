import React, { Component } from 'react';
import $ from 'jquery';
import Axios from 'axios';
import qs from 'querystring';

class VoteModal extends Component {
  _process = 0;

  constructor(elems) {
    super(elems);

    this.state = { modal_content: '', Selected_Event: '', Ticket_Key: '' };
  }

  componentDidMount = () => {
    $(this.modal).on('show.bs.modal', this.handleModalOpenClick);
    $(this.modal).on('hidden.bs.modal', this.handleModalCloseClick);
  };

  handleModalCloseClick = sender => {
    $(this.modal).modal('hide');
    this._process = 0;
    this.Spinner_list.style.display = 'none';
  };

  handleModalOpenClick = sender => {
    switch (this._process) {
      case 0:
        var pass_event_id = $(sender.relatedTarget).data('id');
        this.setState({
          Selected_Event: pass_event_id,
          modal_content: (
            <div>
              <div className="form-group">
                <label htmlFor="txt_ticketID" className="control-label">
                  Please enter your ticket ID provided by administrator.
                </label>
                <div className="input-group-append">
                  <input
                    type="text"
                    maxLength="24"
                    className="form-control"
                    placeholder="Exact 24 HEX ID"
                    ref={input => {
                      this.ticketID = input;
                    }}
                    onInput={e => this.InputBoxChanged(e)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={e => this.ValidateTicketClicked(e)}
                  >
                    <span className="fas fa-play" />
                  </button>
                </div>
              </div>
            </div>
          )
        });

        break;

      case 1:
        var raw_data = this.CandidateList();

        this.setState({
          modal_content: (
            <div>
              <div className="form-group">
                <label htmlFor="txt_CandidateSelect" className="control-label">
                  Please select your preferred candidate for vote.
                </label>
                <div className="input-group-append">
                  <select
                    className="form-control"
                    ref={select => {
                      this.CandidateSelect = select;
                    }}
                  >
                    {raw_data.map((val, ind) => {
                      return (
                        <option key={ind} value={val.candidate_index}>
                          {val.candidate_name},{' '}
                          {String(val.programme).toUpperCase()}, Current CGPA:{' '}
                          {val.current_cgpa}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={e => this.VoteUpdateClick(e)}
                  >
                    <span className="fas fa-play" />
                  </button>
                </div>
                <br />
                <br />
                <div style={{ color: 'red' }}>
                  <span className="fas fa-exclamation-circle" />
                  &nbsp;&nbsp;
                  <strong>Please note here:</strong>
                  <ul>
                    <li>
                      Please choose carefully before submitting the vote ticket.
                    </li>
                    <li>Once choosed no undo process.</li>
                    <li>Each voters allowed vote once per single activity.</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        });
        break;
    }
  };

  InputBoxChanged = sender => {
    this.ticketID.style.backgroundColor = 'white';
  };

  ValidateTicketClicked = sender => {
    var VoteTicket = this.ticketID.value;

    if (VoteTicket.length != 24) {
      alert(
        'Invalid input, please input valid 24 HEX ticket number provided by administrator!'
      );
    } else {
      this.Spinner_list.style.display = 'initial';
      Axios.get(
        'https://webapi-oscar-server.herokuapp.com/MakeVote/ValidateTicket',
        {
          params: { EventKey: this.state.Selected_Event, TicketKey: VoteTicket }
        }
      )
        .then(res => {
          if (typeof res.data.error !== 'undefined') {
            alert('Server error!');
          } else if (
            res.data.ValidTicket == false ||
            res.data.MatchTicketWithEvent == false
          ) {
            alert(
              'Invalid ticket number, please contact administrator to obtain ticket ID.'
            );
            this.ticketID.style.backgroundColor = 'red';
          } else if (res.data.Started == false) {
            alert("The event haven't started, unable to vote.");
            this.ticketID.style.backgroundColor = 'red';
          } else if (res.data.Expired == true) {
            alert('The event expired, unable to vote.');
            this.ticketID.style.backgroundColor = 'red';
          } else if (res.data.Voted == true) {
            alert('You voted this event, unable to vote.');
            this.ticketID.style.backgroundColor = 'red';
          } else {
            this._process++;
            this.handleModalOpenClick(null);
            this.setState({ Ticket_Key: VoteTicket });
          }

          this.Spinner_list.style.display = 'none';
        })
        .catch(err => {
          console.log('[React Data Fetch] Error obtaining data. ' + err);
          this.Spinner_list.style.display = 'none';
        });
    }
  };

  CandidateList = () => {
    var d = [];

    $.ajax({
      dataType: 'json',
      method: 'GET',
      url: 'https://webapi-oscar-server.herokuapp.com/MakeVote/CandidateList',
      async: false,
      data: {
        EventKey: this.state.Selected_Event
      },
      statusCode: {
        304: e => {
          d = e;
        },
        200: e => {
          d = e;
        }
      }
    });

    return d;
  };

  VoteUpdateClick = sender => {
    if (
      window.confirm(
        "Are you sure want to vote this candidate? Once voted can't revert."
      ) == false
    )
      return;

    this.Spinner_list.style.display = 'initial';
    $.ajax({
      dataType: 'json',
      method: 'POST',
      url: 'https://webapi-oscar-server.herokuapp.com/MakeVote/UpdateVote',
      async: true,
      data: JSON.stringify({
        EventKey: this.state.Selected_Event,
        TicketKey: this.state.Ticket_Key,
        SelectedCand: this.CandidateSelect.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: {
        304: r => {
          if (r.result == true) {
            alert('You voted this candidate in this event');
          } else {
            alert("You haven't vote this candidate in this event");
          }

          $(this.modal).modal('hide');
          this.Spinner_list.style.display = 'none';
        },
        200: e => {
          if (e.result == true) {
            alert('You voted this candidate in this event');
          } else {
            alert("You haven't vote this candidate in this event");
          }

          $(this.modal).modal('hide');
          this.Spinner_list.style.display = 'none';
        }
      }
    });
  };

  render = () => {
    return (
      <div
        id="vote_modal"
        className="modal fade"
        role="dialog"
        ref={modal => (this.modal = modal)}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Make a new vote</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" id="modal-body-container">
              {this.state.modal_content}
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
    );
  };
}

export default VoteModal;
