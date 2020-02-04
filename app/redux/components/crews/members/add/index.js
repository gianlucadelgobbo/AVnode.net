import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../../selectors";
import { showModal, hideModal } from "../../../modal/actions";
import { bindActionCreators } from "redux";
import { fetchModel, saveModel } from "../actions";
import { loadSuggestion, fetchCrewMembers } from "../../../../api";
import ErrorMessage from "../../../errorMessage";

const getSuggestionValue = suggestion => suggestion.stagename;

const getSuggestionID = suggestion => suggestion._id;

const renderSuggestion = suggestion => (
  <div id={suggestion._id}>{suggestion.stagename}</div>
);

class AddCrewMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      idmember: "",
      suggestions: [],
      activeSuggestion: 0,
      disable: true
    };
  }

  onChange = (event, obj) => {
    const { suggestions, activeSuggestion } = this.state;
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.stagename.toLowerCase().indexOf(obj.newValue.toLowerCase()) >
        -1
    );

    if (obj.newValue.length >= 3) {
      this.setState({
        disable: false
      });
    } else {
      this.setState({
        disable: true
      });
    }

    if (event.target.children.length !== 0) {
      this.setState({
        value: obj.newValue,
        idmember: event.target.children[0].id
      });
    } else {
      this.setState({
        value: obj.newValue,
        idmember: event.target.id
      });
    }

    if (obj.method === "enter") {
      this.setState({
        value: obj.newValue,
        idmember: filteredSuggestions[activeSuggestion]._id
      });
    }
    if (obj.method === "down") {
      this.setState({
        value: obj.newValue,
        idmember: filteredSuggestions[activeSuggestion]._id
      });
    }
  };

  onSuggestionsFetchRequested = ({ value }) => {
    if (value.length >= 3) {
      return loadSuggestion({ value }).then(response =>
        this.setState({ suggestions: response.data })
      );
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  createModelToSave(idmember, id) {
    //clone obj
    let model = {};

    model.idmember = idmember;

    model.id = id;

    return model;
  }

  onSubmitForm(idmember) {
    const { id } = this.props;
    const { saveModel, hideModal } = this.props;
    const modelToSave = this.createModelToSave(idmember, id);
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model._id) {
        fetchCrewMembers({ id: id }).then(response => hideModal());
      }
    });
  }

  render() {
    const { showModal, errorMessage } = this.props;

    const { value, suggestions, idmember, disable } = this.state;

    const inputProps = {
      className: "form-control",
      placeholder: "Type the first three character",
      value,
      idmember,
      onChange: this.onChange
    };

    return (
      <div className="row">
        <div className="col-md-12">
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
          <Form
            onSubmitForm={this.onSubmitForm.bind(this)}
            showModal={showModal}
            name="members"
            inputProps={inputProps}
            suggestions={suggestions}
            placeholder="Members"
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(
              this
            )}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(
              this
            )}
            getSuggestionValue={getSuggestionValue}
            getSuggestionID={getSuggestionID}
            renderSuggestion={renderSuggestion}
            disable={disable}
          />
        </div>
      </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, { id }) => {
  return {
    model: getModel(state),
    errorMessage: getModelErrorMessage(state, id)
  };
};

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

AddCrewMember = connect(mapStateToProps, mapDispatchToProps)(AddCrewMember);

export default AddCrewMember;
