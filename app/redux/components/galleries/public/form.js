import React, { Component } from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import { FORM_NAME } from "./constants";
import {
  inputText,
  textareaMultiTab,
  fieldWithLabel,
  uploadGallery
} from "../../common/form/components";
import validate from "./validate";
import { injectIntl } from "react-intl";
import {
  ABOUT,
  GALLERIES_NAME,
  GALLERIES_URL,
  GALLERIES_URL_PRE,
  GALLERIES_URL_HELP,
  AUTHORS
} from "../../common/form/labels";

class VideosPublicForm extends Component {
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
      uploadFile,
      media
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          component={inputText}
          placeholder={this.getIntlString({ id: GALLERIES_NAME })}
        />

        <Field
          name="slug"
          component={inputText}
          placeholder={this.getIntlString({ id: GALLERIES_URL })}
          pre={this.getIntlString({ id: GALLERIES_URL_PRE })}
          help={this.getIntlString({ id: GALLERIES_URL_HELP })}
        />

        <Field
          name="galleries"
          component={uploadGallery}
          showModal={showModal}
          accept="image/jpeg, image/png"
          maxSize={21474836480}
          uploadFile={uploadFile}
          uploadButton={true}
          media={media}
          multiple={true}
        />

        <FieldArray
          name="abouts"
          component={textareaMultiTab}
          tabs={tabs}
          labels={labels}
          placeholder={this.getIntlString({ id: ABOUT })}
        />

        <br />

        <FieldArray
          name="users"
          component={fieldWithLabel}
          placeholder={this.getIntlString({ id: AUTHORS })}
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

VideosPublicForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate
  //asyncValidate,
  //asyncBlurFields: ['slug', 'addresses[]']
})(VideosPublicForm);

VideosPublicForm = injectIntl(VideosPublicForm);

export default VideosPublicForm;
