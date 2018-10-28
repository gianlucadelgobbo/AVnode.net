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

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

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
    return loadSuggestion({ value }).then(response =>
      this.setState({ suggestions: response.data.results })
    );
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values);

    model = model.members;

    return model;
  }

  submitForm(event, value) {
    event.preventDefault();
    const { saveModel } = this.props;
    const modelToSave = this.createModelToSave(value);
    return saveModel(modelToSave).then(model => {
      if (model && model.id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }

  render() {
    const { submitting } = this.props;
    const { value, suggestions } = this.state;

    const inputProps = {
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
          onClick={() => this.submitForm(event, value)}
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
  bindActionCreators({ saveModel }, dispatch);

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
