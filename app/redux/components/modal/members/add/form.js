import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FORM_NAME } from "./constants";
import { autocompleteComponent } from "../../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { saveModel } from "../../../crews/members/actions";
import { loadSuggestion } from "../../../../api";
import { showModal } from "../../actions";
import { MODAL_SAVED } from "../../constants";

const getSuggestionValue = suggestion => suggestion.stagename;

const renderSuggestion = suggestion => <div>{suggestion.stagename}</div>;

class AddMembersForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
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

  createModelToSave(value, id) {
    //clone obj
    let model = {};

    model.value = value;

    model.id = id;

    return model;
  }

  submitForm(event, value, id) {
    event.preventDefault();
    const { saveModel, showModal } = this.props;
    const modelToSave = this.createModelToSave(value, id);
    return saveModel(modelToSave).then(model => {
      if (model && model.id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }

  render() {
    const { submitting, id } = this.props;
    const { value, suggestions } = this.state;

    const inputProps = {
      className: "form-control",
      placeholder: "Type a members",
      value,
      onChange: this.onChange
    };

    return (
      <div>
        <Field
          name="members"
          component={autocompleteComponent}
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
          renderSuggestion={renderSuggestion}
        />

        <hr />

        <button
          disabled={submitting}
          onClick={() => this.submitForm(event, value, id)}
          className="btn btn-primary btn-lg btn-block"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ saveModel, showModal }, dispatch);

AddMembersForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMembersForm);

AddMembersForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate
  //asyncBlurFields: ['slug', 'addresses']
})(AddMembersForm);

export default AddMembersForm;
