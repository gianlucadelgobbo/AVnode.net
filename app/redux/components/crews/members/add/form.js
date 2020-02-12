import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FORM_NAME } from "./constants";
import {
  autocompleteComponent,
  autoCompleteSelectAsync
} from "../../../common/form/components";
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
      disable,
      loadOptions,
      handleSubmit,
      placeholder,
      label,
      value,
      getOptionValue,
      getOptionLabel,
      onSelectResetsInput,
      onBlurResetsInput,
      name,
      noOptionsMessage
    } = this.props;

    /*const { idmember } = inputProps;*/

    return (
      <form onSubmit={handleSubmit}>
        {/*
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

        */}

        <Field
          name={name}
          component={autoCompleteSelectAsync}
          placeholder={placeholder}
          label={label}
          multi={false}
          loadOptions={loadOptions}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          onSelectResetsInput={onSelectResetsInput}
          onBlurResetsInput={onBlurResetsInput}
          value={value}
          noOptionsMessage={noOptionsMessage}
        />

        <hr />
        <button
          type="submit"
          disabled={disable}
          className="btn btn-primary btn-lg btn-block"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
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
