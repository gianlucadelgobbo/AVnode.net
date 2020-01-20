import React, { Component } from "react";
import { reduxForm, Field, FieldArray, getFormSyncErrors } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FORM_NAME, SECTION } from "./constants";
import {
  inputText,
  textareaMultiTab,
  checkboxField,
  /* tagsInput, */
  fieldWithLabel
} from "../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { injectIntl } from "react-intl";
import {
  ABOUT,
  NEWS_NAME,
  NEWS_URL,
  IS_PUBLIC,
  NEWS_URL_PRE,
  NEWS_URL_HELP,
  AUTHORS /* ,
  TAGS */
} from "../../common/form/labels";

class NewsPublicForm extends Component {
  getIntlString = obj => {
    const { intl } = this.props;
    return intl.formatMessage(obj);
  };

  render() {
    const {
      submitting,
      handleSubmit,
      tabs,
      labels,
      showModal,
      onSubmit,
      /* delimiters, */
      handleDelete,
      handleDrag,
      handleAddition,
      tags,
      model,
      _id,
      removeModel
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          component={inputText}
          placeholder={this.getIntlString({ id: NEWS_NAME })}
        />

        <Field
          name="slug"
          component={inputText}
          placeholder={this.getIntlString({ id: NEWS_URL })}
          pre={this.getIntlString({ id: NEWS_URL_PRE })}
          help={this.getIntlString({ id: NEWS_URL_HELP })}
        />

        <FieldArray
          name="abouts"
          component={textareaMultiTab}
          tabs={tabs}
          labels={labels}
          placeholder={this.getIntlString({ id: ABOUT })}
        />

        <br />

        <Field
          name="is_public"
          component={checkboxField}
          placeholder={this.getIntlString({ id: IS_PUBLIC })}
        />
        <br />

        <FieldArray
          name="users"
          component={fieldWithLabel}
          placeholder={this.getIntlString({ id: AUTHORS })}
          showModal={showModal}
          _id={_id}
          removeModel={removeModel}
          users={model.users}
          SECTION={SECTION}
          param="stagename"
        />

        <br />

        {/* <Field
          name="tags"
          component={tagsInput}
          tags={tags}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleDrag={handleDrag}
          handleAddition={handleAddition}
          placeholder={this.getIntlString({ id: TAGS })}
        />

        <br /> */}

        <hr />

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-lg btn-block"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    );
  }
}

NewsPublicForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(NewsPublicForm);

//Get form's initial values from redux state here
const mapStateToProps = state => ({
  errors: getFormSyncErrors(FORM_NAME)(state)
});
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

NewsPublicForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsPublicForm);

NewsPublicForm = injectIntl(NewsPublicForm);

export default NewsPublicForm;
