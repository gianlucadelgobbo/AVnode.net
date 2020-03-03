import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import { autoCompleteSelectAsync } from "../../common/form/components";

class AddUsersForm extends Component {
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

    return (
      <form onSubmit={handleSubmit}>
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
          className="btn btn-primary btn-large btn-block"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
  //validate,
})(AddUsersForm);
