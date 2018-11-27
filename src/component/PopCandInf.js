import React, { Component } from 'react';
import './PopCandInf.css';
import $ from 'jquery';
import '@fortawesome/fontawesome-free/css/all.css';

class PopCandInf extends Component {
  constructor() {
    super();

    this.state = {
      cand_name: null,
      cand_age: null,
      prog: null,
      skul: null,
      sem: null,
      cgpa: null
    };
  }

  componentDidMount = () => {
    $(this.modal).on('show.bs.modal', this.HandleModalOpen);
    $(this.modal).on('hidden.bs.modal', this.HandleModalClose);
  };

  HandleModalClose = sender => {
    $(this.modal).modal('hide');
    this.SubForm_1.reset();
    this.state = {
      cand_name: null,
      cand_age: null,
      prog: null,
      skul: null,
      sem: null,
      cgpa: null
    };
  };

  HandleModalOpen = sender => {};

  HandleChangeInput = (sender, inputs) => {
    switch (inputs) {
      case 'name':
        this.setState({ cand_name: this.Input_Name.value });
        break;

      case 'age':
        this.setState({ cand_age: this.Input_Age.value });
        break;

      case 'prog':
        this.setState({ prog: this.Input_Program.value });
        break;

      case 'skul':
        this.setState({ skul: this.Input_School.value });
        break;

      case 'sem':
        this.setState({ sem: this.Input_Semester.value });
        break;

      case 'cgpa':
        this.setState({ cgpa: this.Input_CGPA.value });
        break;
    }
  };

  AddCandidateClicked = sender => {
    var isEmpty = false;

    for (var data in this.state) {
      if (this.state[data] === null) {
        isEmpty = true;
        break;
      }
    }

    if (isEmpty == true) {
      alert('Invalid input, please input again.');
    } else {
      this.props.onCandidateAdded(this.state);
      $(this.modal).modal('hide');
    }
  };

  render = () => {
    return (
      <div>
        <div
          className="modal fade"
          id="add_cand_modal"
          role="dialog"
          ref={modal => (this.modal = modal)}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Candidate</h4>
              </div>
              <div className="modal-body">
                <form method="post" ref={forms => (this.SubForm_1 = forms)}>
                  <div className="form-group">
                    <label htmlFor="CandidateName" className="control-label">
                      Candidate Name
                    </label>
                    <input
                      type="text"
                      maxLength="50"
                      className="form-control"
                      placeholder="Candidate Name"
                      ref={name => (this.Input_Name = name)}
                      onChange={e => this.HandleChangeInput(e, 'name')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="CandidateAge" className="control-label">
                      Candidate Age
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Candidate Age"
                      min="17"
                      max="70"
                      ref={age_inp => (this.Input_Age = age_inp)}
                      onBlur={e => {
                        this.Input_Age.value < 17 || this.Input_Age.value > 70
                          ? (this.Input_Age.value = 20)
                          : (this.Input_Age.value = this.Input_Age.value);
                        this.HandleChangeInput(e, 'age');
                      }}
                      onChange={e => this.HandleChangeInput(e, 'age')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Programme" className="control-label">
                      Program
                    </label>
                    <input
                      type="text"
                      maxLength="10"
                      className="form-control"
                      placeholder="Current Candidate study program"
                      ref={prog => (this.Input_Program = prog)}
                      onBlur={e => {
                        this.Input_Program.value = this.Input_Program.value.toUpperCase();
                      }}
                      onChange={e => this.HandleChangeInput(e, 'prog')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="School" className="control-label">
                      School
                    </label>
                    <input
                      type="text"
                      maxLength="10"
                      className="form-control"
                      placeholder="Current Candidate study school"
                      ref={skul => (this.Input_School = skul)}
                      onBlur={e => {
                        this.Input_School.value = this.Input_School.value.toUpperCase();
                      }}
                      onChange={e => this.HandleChangeInput(e, 'skul')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="Semester" className="control-label">
                      Semester
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Semester"
                      min="1"
                      max="16"
                      ref={sem => (this.Input_Semester = sem)}
                      onBlur={e => {
                        this.Input_Semester.value < 1 ||
                        this.Input_Semester.value > 16
                          ? (this.Input_Semester.value = 5)
                          : (this.Input_Semester.value = this.Input_Semester.value);
                        this.HandleChangeInput(e, 'sem');
                      }}
                      onChange={e => this.HandleChangeInput(e, 'sem')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="curr_cgpa" className="control-label">
                      Current CGPA
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Semester"
                      min="1.00"
                      max="4.00"
                      step="0.01"
                      ref={cgpa => (this.Input_CGPA = cgpa)}
                      onBlur={e => {
                        this.Input_CGPA.value < 1.0 ||
                        this.Input_CGPA.value > 4.0
                          ? (this.Input_CGPA.value = 3.5)
                          : (this.Input_CGPA.value = this.Input_CGPA.value);
                        this.HandleChangeInput(e, 'cgpa');
                      }}
                      onChange={e => this.HandleChangeInput(e, 'cgpa')}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={e => this.AddCandidateClicked(e)}
                >
                  Add New Candidate
                </button>
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

export default PopCandInf;
