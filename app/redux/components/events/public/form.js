import React, { Component } from "react";
import { reduxForm, Field, FieldArray, getFormSyncErrors } from "redux-form";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FORM_NAME, SECTION } from "./constants";
import {
  renderList,
  multiSchedule,
  inputText,
  textareaMultiTab,
  checkboxField,
  multiInputUrl,
  multiInputEmail,
  multiInputTel,
  fieldWithLabel
} from "../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import {
  SCHEDULE,
  ABOUT,
  IS_PUBLIC,
  CATEGORY,
  SUBTITLES,
  EVENT_URL,
  TITLE,
  WEB,
  SOCIAL,
  EMAILS,
  PHONE,
  AUTHORS
} from "../../common/form/labels";
import { injectIntl } from "react-intl";

class EventPublicForm extends Component {
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
      categories,
      errors,
      _id,
      model,
      removeModel
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          component={inputText}
          placeholder={this.getIntlString({ id: TITLE })}
        />

        <Field
          name="slug"
          component={inputText}
          placeholder={this.getIntlString({ id: EVENT_URL })}
        />

        <Field
          name="type"
          component={renderList}
          placeholder={this.getIntlString({ id: CATEGORY })}
          multiple={false}
          options={categories}
        />

        <FieldArray
          name="schedule"
          component={multiSchedule}
          placeholder={this.getIntlString({ id: SCHEDULE })}
          showModal={showModal}
        />

        <br />

        <FieldArray
          name="subtitles"
          component={textareaMultiTab}
          tabs={tabs}
          labels={labels}
          placeholder={this.getIntlString({ id: SUBTITLES })}
          errors={errors}
        />

        <br />

        <FieldArray
          name="abouts"
          component={textareaMultiTab}
          tabs={tabs}
          labels={labels}
          placeholder={this.getIntlString({ id: ABOUT })}
          errors={errors}
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
        />
        <br />

        <Field
          name="is_public"
          component={checkboxField}
          placeholder={this.getIntlString({ id: IS_PUBLIC })}
        />

        <FieldArray
          name="web"
          component={multiInputUrl}
          placeholder={this.getIntlString({ id: WEB })}
          title="Web"
          showModal={showModal}
          errors={errors}
        />

        <br />

        <FieldArray
          name="social"
          component={multiInputUrl}
          placeholder={this.getIntlString({ id: SOCIAL })}
          title="Socials"
          showModal={showModal}
        />

        <br />

        <FieldArray
          name="emails"
          component={multiInputEmail}
          placeholder={this.getIntlString({ id: EMAILS })}
          showModal={showModal}
        />

        <br />

        <FieldArray
          name="phones"
          component={multiInputTel}
          placeholder={this.getIntlString({ id: PHONE })}
          showModal={showModal}
        />

        <br />

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

EventPublicForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug", "schedule[].venue"]
})(EventPublicForm);

//Get form's initial values from redux state here
const mapStateToProps = state => ({
  errors: getFormSyncErrors(FORM_NAME)(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

EventPublicForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventPublicForm);

EventPublicForm = injectIntl(EventPublicForm);

export default EventPublicForm;
