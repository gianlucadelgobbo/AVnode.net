import React, { Component } from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import { FORM_NAME } from "./constants";
import {
  inputText,
  textareaMultiTab,
  fieldWithLabel,
  uploadComponent
} from "../../common/form/components";
import validate from "./validate";
import { injectIntl } from "react-intl";
import {
  ABOUT,
  VIDEOS_NAME,
  VIDEOS_URL,
  VIDEOS_URL_PRE,
  VIDEOS_URL_HELP,
  AUTHORS
} from "../../common/form/labels";

class FootageVideoForm extends Component {
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
          name="video"
          component={uploadComponent}
          showModal={showModal}
          accept="video/mp4, video/mpg, video/quicktime, video/x-flv, video/x-ms-wmv, video/x-msvideo"
          maxSize={21474836480}
          uploadFile={uploadFile}
          uploadButton={true}
          media={media}
          multiple={false}
          //accept={this.renderImageType()}
        />
      </form>
    );
  }
}

FootageVideoForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate
  //asyncValidate,
  //asyncBlurFields: ['slug', 'addresses[]']
})(FootageVideoForm);

FootageVideoForm = injectIntl(FootageVideoForm);

export default FootageVideoForm;
