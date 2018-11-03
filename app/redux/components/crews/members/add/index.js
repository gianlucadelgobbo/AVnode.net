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
import { loadSuggestion } from "../../../../api";
import ErrorMessage from "../../../errorMessage";

const getSuggestionValue = suggestion => suggestion.stagename;

const getSuggestionID = suggestion => suggestion.id;

const renderSuggestion = suggestion => (
  <div id={suggestion.id}>{suggestion.stagename}</div>
);

class AddCrewMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      idmember: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      idmember: event.target.id
    });
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
    const { fetchModel, saveModel, hideModal } = this.props;
    const modelToSave = this.createModelToSave(idmember, id);
    return saveModel(modelToSave).then(model => {
      if (model && model.id) {
        fetchModel({ id: id });
        hideModal();
      }
    });
  }

  render() {
    const { showModal, errorMessage } = this.props;

    const { value, suggestions, idmember } = this.state;

    const inputProps = {
      className: "form-control",
      placeholder: "Type a members",
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

AddCrewMember = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCrewMember);

export default AddCrewMember;
