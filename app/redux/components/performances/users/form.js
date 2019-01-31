import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import { userAutocompleteSelect } from "../../common/form/components";
import { autocompleteComponent } from "../../common/form/components";
//import validate from './validate';

class AddUsersForm extends Component {
  render() {
    const {
      submitting,
      inputProps,
      suggestions,
      placeholder,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      getSuggestionValue,
      getSuggestionID,
      renderSuggestion,
      name,
      onSubmitForm
    } = this.props;

    const { idusers } = inputProps;

    return (
      <div>
        <Field
          name={name}
          component={autocompleteComponent}
          inputProps={inputProps}
          suggestions={suggestions}
          placeholder={placeholder}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          getSuggestionID={getSuggestionID}
          renderSuggestion={renderSuggestion}
        />

        <hr />

        <button
          type="submit"
          disabled={submitting}
          onClick={() => onSubmitForm(idusers)}
          className="btn btn-primary btn-large btn-block"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    );
  }
}

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
  //validate,
})(AddUsersForm);
