import React, { Component } from 'react';
import Axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import $ from 'jquery';

class ViewEvent extends Component {
  constructor() {
    super();

    this.state = {
      EventList: []
    };

    this.SelectedEvent = [];
  }

  componentDidMount = () => {
    $(this.modal).on('show.bs.modal', this.HandleModalOpen);
    $(this.modal).on('hidden.bs.modal', this.HandleModalClose);
  };

  HandleModalClose = sender => {
    $(this.modal).modal('hide');
    this.SelectedEvent = [];
    this.setState({ EventList: [] });
  };

  HandleModalOpen = sender => {
    this.GetEventList();
  };

  EventListChecked = sender => {
    var pid = sender.target.value;
    var isChecked = sender.target.checked;

    if (isChecked) {
      this.SelectedEvent.push(pid);
    } else {
      for (var i = 0; i < this.SelectedEvent.length; i++) {
        if (this.SelectedEvent[i] == pid) {
          this.SelectedEvent.splice(i, 1);
          break;
        }
      }
    }
  };

  GetEventList = () => {
    this.Spinner_list.style.display = 'initial';
    Axios.get(
      'https://webapi-oscar-server.herokuapp.com/VoteResult/MakeVoteList'
    )
      .then(response => {
        var result = response.data;
        var rec_data = [];

        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            if (i % 2 == 0) {
              rec_data.push(
                <li key={i} className="list-group-item list-group-item-primary">
                  <input
                    type="checkbox"
                    value={result[i]._id}
                    onChange={e => this.EventListChecked(e)}
                  />
                  &nbsp; Event Title:&nbsp;{result[i].title},&nbsp; Created
                  Date:&nbsp;{this.formatUTCtoNormal(result[i].created_date)}
                </li>
              );
            } else {
              rec_data.push(
                <li key={i} className="list-group-item list-group-item-info">
                  <input
                    type="checkbox"
                    value={result[i]._id}
                    onChange={e => this.EventListChecked(e)}
                  />
                  &nbsp; Event Title:&nbsp;{result[i].title},&nbsp; Created
                  Date:&nbsp;{this.formatUTCtoNormal(result[i].created_date)}
                </li>
              );
            }
          }
        } else {
          rec_data.push(
            <li key={0} className="list-group-item list-group-item-danger">
              <i className="fas fa-exclamation-triangle" />
              &nbsp;&nbsp;No event in database.
            </li>
          );
        }

        this.setState({ EventList: rec_data });

        this.Spinner_list.style.display = 'none';
      })
      .catch(error => {
        alert('Unable to retrieve result.');
        this.Spinner_list.style.display = 'none';
      });
  };

  RemoveClicked = sender => {
    if (this.SelectedEvent.length <= 0) {
      alert('No event selected!');
    } else {
      if (window.confirm('Are you sure want to delete record?') == false)
        return;

      this.Spinner_list.style.display = 'initial';

      $.ajax({
        method: 'POST',
        dataType: 'json',
        url: 'https://webapi-oscar-server.herokuapp.com/AdminMgr/DeleteEvent',
        async: true,
        data: JSON.stringify({
          SelectedEvent: this.SelectedEvent
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: {
          304: e => {
            if (e.result == true) {
              alert('Event deleted!');
            } else {
              alert('Event not deleted!');
            }

            this.Spinner_list.style.display = 'none';
            this.SelectedEvent = [];
            this.setState({ EventList: [] });
            this.GetEventList();
          },
          200: e => {
            if (e.result == true) {
              alert('Event deleted!');
            } else {
              alert('Event not deleted!');
            }

            this.Spinner_list.style.display = 'none';
            this.SelectedEvent = [];
            this.setState({ EventList: [] });
            this.GetEventList();
          }
        }
      });
    }
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
          id="view_event"
          data-keyboard="false"
          data-backdrop="static"
          ref={modal => (this.modal = modal)}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-warning text-white">
              <div className="modal-header">
                <h4 className="modal-title">Vote Event List</h4>
              </div>
              <div
                className="modal-body"
                style={{ height: 700, maxHeight: 700, overflowY: 'scroll' }}
              >
                <ul className="list-group">
                  {this.state.EventList.map((val, index) => {
                    return val;
                  })}
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={e => this.RemoveClicked(e)}
                >
                  Remove Event
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

export default ViewEvent;
