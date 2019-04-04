import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import { getModel, getModelErrorMessage } from "../selectors";
import { showModal, hideModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
//import { MODAL_SAVED } from "../../modal/constants";
import { saveModel } from "./actions";
import { fetchModel } from "../public/actions";
//import { fetchList as fetchUsers } from "./actions";
import { getList as getUsers } from "./selectors";
import { loadSuggestionAuthors, fetchPerformancePublic } from "../../../api";
import ErrorMessage from "../../errorMessage";

const getSuggestionValue = suggestion => suggestion.stagename;

const getSuggestionID = suggestion => suggestion._id;

const renderSuggestion = suggestion => (
  <span id={suggestion._id}>{suggestion.stagename}</span>
);

class AddUsersFootage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      idusers: "",
      suggestions: []
    };
  }

  componentDidMount() {}

  onChange = (event, { newValue }) => {
    if (event.target.children.length !== 0) {
      this.setState({
        value: newValue,
        idusers: event.target.children[0].id
      });
    } else {
      this.setState({
        value: newValue,
        idusers: event.target.id
      });
    }
  };

  onSuggestionsFetchRequested = ({ value }) => {
    if (value.length >= 3) {
      return loadSuggestionAuthors({ value }).then(response =>
        this.setState({ suggestions: response.data })
      );
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // Convert form values to API model
  createModelToSave(idusers, _id) {
    //clone obj
    let model = {};

    model.idusers = idusers;

    model._id = _id;

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model } = this.props;

    if (!model) {
      return {};
    }

    let v = {};

    return v;
  }

  onSubmitForm(idusers) {
    const { fetchModel, saveModel, hideModal, _id } = this.props;
    const modelToSave = this.createModelToSave(idusers, _id);
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model._id) {
        fetchPerformancePublic({ id: _id }).then(response => hideModal());
      }
    });
  }

  render() {
    const { showModal, errorMessage } = this.props;

    const { value, suggestions, idusers } = this.state;

    const inputProps = {
      className: "form-control",
      placeholder: "Type a users",
      value,
      idusers,
      onChange: this.onChange
    };

    return (
      <div className="row">
        <div className="col-md-12">
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
          <Form
            onSubmitForm={this.onSubmitForm.bind(this)}
            showModal={showModal}
            name="users"
            inputProps={inputProps}
            suggestions={suggestions}
            placeholder="Users"
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(
              this
            )}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(
              this
            )}
            getSuggestionValue={getSuggestionValue}
            getSuggestionID={getSuggestionID}
            renderSuggestion={renderSuggestion}
          />
        </div>
      </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, { _id }) => ({
  model: getModel(state),
  users: getUsers(state),
  errorMessage: getModelErrorMessage(state, _id)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModal,
      hideModal,
      saveModel,
      fetchModel
    },
    dispatch
  );

AddUsersFootage = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUsersFootage);

export default AddUsersFootage;
