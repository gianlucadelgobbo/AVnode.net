import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FORM_NAME } from "./constants";
import { autocompleteComponent } from "../../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { fetchModel, saveModel } from "../../../crews/members/actions";
import { loadSuggestion } from "../../../../api";
import { showModal, hideModal } from "../../actions";
import { MODAL_SAVED } from "../../constants";


class AddMembersForm extends Component {

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
    
    const { idmember } = inputProps;

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
          disabled={submitting}
          onClick={()=>onSubmitForm(idmember)}
          className="btn btn-primary btn-lg btn-block"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    );
  }
}


AddMembersForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate
  //asyncBlurFields: ['slug', 'addresses']
})(AddMembersForm);

export default AddMembersForm;
