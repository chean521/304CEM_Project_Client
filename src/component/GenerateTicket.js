import React, { Component } from 'react';
import './AdminMgr.css';
import Axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import $ from 'jquery';

class GenerateTicket extends Component {
  constructor() {
    super();
    this.state = {
      avail_list: []
    };
  }

  componentDidMount = () => {
    $(this.modal).on('show.bs.modal', this.HandleModalOpen);
    $(this.modal).on('hidden.bs.modal', this.HandleModalClose);
  };

  HandleModalClose = sender => {
    $(this.modal).modal('hide');
    this.MainForm.reset();
    this.AddTicket.removeAttribute('disabled');
    this.NewTicket.style.display = 'none';
  };

  HandleModalOpen = sender => {
    this.AvailableEvent();
  };

  CopyClipboard = sender => {
    this.TicketID.select();
    document.execCommand('copy');
  };

  GenerateClicked = sender => {
    var TicketData = {
      target_activity: this.TargetEvent.value,
      vote_date: null,
      voter_name: this.VoterName.value,
      programme: this.VoterProg.value
    };

    if (
      TicketData.target_activity == '' ||
      TicketData.voter_name == '' ||
      TicketData.programme == ''
    ) {
      alert('Invalid input, please input again!');
    } else {
      this.AddTicket.setAttribute('disabled', 'disabled');
      this.Spinner_list.style.display = 'initial';

      $.ajax({
        dataType: 'json',
        method: 'POST',
        url:
          'https://webapi-oscar-server.herokuapp.com/AdminMgr/GenerateTicket',
        async: true,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          TicketData: {
            TgActivity: TicketData.target_activity,
            VoterName: TicketData.voter_name,
            Programme: TicketData.programme
          }
        }),
        statusCode: {
          200: res => {
            this.Spinner_list.style.display = 'none';
            this.NewTicket.style.display = 'initial';

            var pid = res.result.ticket;

            this.TicketID.value = pid;
          },
          304: res => {
            this.Spinner_list.style.display = 'none';
            this.NewTicket.style.display = 'initial';

            var pid = res.result.ticket;

            this.TicketID.value = pid;
          }
        }
      });
    }
  };

  AvailableEvent = () => {
    Axios.get(
      'https://webapi-oscar-server.herokuapp.com/VoteResult/VoteListAvailable'
    )
      .then(response => {
        var list = [];
        var result = response.data.result;

        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            list.push(
              <option key={i} value={result[i]._id}>
                {result[i].title} - Created Date:{' '}
                {this.formatUTCtoNormal(result[i].created_date)}
              </option>
            );
          }
        } else {
          list.push(
            <option key={0} value="" disabled={true}>
              No available event.
            </option>
          );
        }

        this.setState({ avail_list: list });
      })
      .catch(error => {
        alert('Unable to get available list.');
      });
  };

  NewTicketClick = sender => {
    this.NewTicket.style.display = 'none';
    this.MainForm.reset();
    this.AddTicket.removeAttribute('disabled');
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
      <div>
        <div
          className="modal fade"
          role="dialog"
          data-backdrop="static"
          data-keyboard="false"
          id="NewTicket"
          ref={modal => (this.modal = modal)}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-warning text-white">
              <div className="modal-header">
                <h4 className="modal-title">Generate New Ticket</h4>
              </div>
              <div className="modal-body">
                <form
                  method="post"
                  ref={main_form => (this.MainForm = main_form)}
                >
                  <div className="form-group">
                    <label htmlFor="tg_evt" className="control-label">
                      Target Event
                    </label>
                    <select
                      className="form-control"
                      ref={tgEvt => (this.TargetEvent = tgEvt)}
                    >
                      {this.state.avail_list.map((val, ind) => {
                        return val;
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="tg_voter" className="control-label">
                      Voter Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="50"
                      ref={names => (this.VoterName = names)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tg_prog" className="control-label">
                      Program
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="20"
                      ref={prog => (this.VoterProg = prog)}
                      onInput={e => {
                        this.VoterProg.value = this.VoterProg.value.toUpperCase();
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tg_ticket" className="control-label">
                      Generated Ticket ID
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        maxLength="24"
                        readOnly={true}
                        ref={ticket => (this.TicketID = ticket)}
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-outline-info"
                          onClick={e => this.CopyClipboard(e)}
                        >
                          <i className="fas fa-copy" />
                        </button>
                      </div>
                    </div>

                    <i style={{ fontSize: 11, fontWeight: 'bold' }}>
                      Please keep this Ticket ID for voting.
                    </i>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-info"
                  onClick={e => this.NewTicketClick(e)}
                  style={{ display: 'none' }}
                  ref={e => (this.NewTicket = e)}
                >
                  New Ticket
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={e => this.GenerateClicked(e)}
                  ref={btn => (this.AddTicket = btn)}
                >
                  Generate
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
      </div>
    );
  };
}

export default GenerateTicket;
