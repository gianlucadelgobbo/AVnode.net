import React, { Component } from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import { FORM_NAME } from "./constants";
import {
  renderDropzoneInput,
  inputText,
  textareaMultiTab,
  tagsInput,
  fieldWithLabel,
  uploadComponent
} from "../../common/form/components";
import validate from "./validate";
import { injectIntl } from "react-intl";
import {
  ABOUT,
  FOOTAGE_NAME,
  FOOTAGE_URL,
  AUTHORS,
  TAGS
} from "../../common/form/labels";

class FootagePublicForm extends Component {
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
      delimiters,
      handleDelete,
      handleTagClick,
      handleAddition,
      tags,
      uploadFile,
      media
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          component={inputText}
          placeholder={this.getIntlString({ id: FOOTAGE_NAME })}
        />

        <Field
          name="slug"
          component={inputText}
          placeholder={this.getIntlString({ id: FOOTAGE_URL })}
        />

        <Field
          name="media"
          component={uploadComponent}
          showModal={showModal}
          //properties={["jpeg, png"]}
          accept="video/mp4, video/mpg, video/quicktime, video/x-flv, video/x-ms-wmv, video/x-msvideo"
          maxSize={21474836480}
          uploadFile={uploadFile}
          uploadButton={true}
          media={media}
          //accept={this.renderImageType()}
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

        <Field
          name="tags"
          component={tagsInput}
          tags={tags}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleTagClick={handleTagClick}
          handleAddition={handleAddition}
          placeholder={this.getIntlString({ id: TAGS })}
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

FootagePublicForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate
  //asyncValidate,
  //asyncBlurFields: ['slug', 'addresses[]']
})(FootagePublicForm);

FootagePublicForm = injectIntl(FootagePublicForm);

export default FootagePublicForm;
