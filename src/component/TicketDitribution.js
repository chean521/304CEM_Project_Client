import React, { Component } from 'react';
import './TicketDistribution.css';
import Axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import Chart from 'chart.js';
import $ from 'jquery';

class TicketDistribution extends Component {
  constructor() {
    super();

    this.mix_chart = null;
  }

  componentDidMount = () => {
    $(this.modal).on('show.bs.modal', this.HandleModalOpen);
    $(this.modal).on('hidden.bs.modal', this.HandleModalClose);
  };

  HandleModalClose = sender => {
    $(this.modal).modal('hide');
  };

  HandleModalOpen = sender => {
    this.WriteChart();
  };

  WriteChart = () => {
    if (this.mix_chart !== null) this.mix_chart.destroy();

    Axios.get(
      'https://webapi-oscar-server.herokuapp.com/AdminMgr/TicketDistribution'
    )
      .then(response => {
        this.mix_chart = new Chart(this.StatChart, {
          type: 'bar',
          data: {
            datasets: [
              {
                label: 'Total Ticket Used',
                data: response.data.result.Total_used,
                borderColor: 'rgba(255, 0, 225, 1)',
                backgroundColor: 'rgba(255, 0, 225, 0.5)'
              },
              {
                label: 'Total Ticket Generated',
                data: response.data.result.Total_created,
                type: 'line',
                borderColor: 'rgba(255, 0,0, 1)',
                fill: false
              }
            ],
            labels: response.data.result.Text
          },
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            },
            responsive: true,
            title: {
              display: true,
              text: 'Ticket Distribution Chart (4 Months)',
              fontColor: 'white',
              fontSize: 15
            },
            legend: {
              display: true,
              labels: {
                fontColor: 'white'
              }
            }
          }
        });
      })
      .catch(error => {
        alert('Error getting response.');
      });
  };

  render = () => {
    return (
      <div>
        <div
          className="modal fade"
          role="dialog"
          data-keyboard="false"
          data-backdrop="static"
          id="ticket_dist"
          ref={modal => (this.modal = modal)}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-warning text-white">
              <div className="modal-header">
                <h4 className="modal-title">Ticket Distribution Information</h4>
              </div>
              <div className="modal-body">
                <div className="card bg-info">
                  <div className="card-header">
                    <h6 className="card-title">
                      <i className="fas fa-chart-pie" />
                      &nbsp;&nbsp;Statistic Chart
                    </h6>
                  </div>
                  <div className="card-body">
                    <canvas
                      style={{ width: 200, height: 100 }}
                      ref={canvas => (this.StatChart = canvas)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default TicketDistribution;
