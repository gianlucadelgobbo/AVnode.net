import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import { inputText } from "../../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { injectIntl } from "react-intl";
import {
  VIDEOS_NAME,
  VIDEOS_EXTERNALURL,
  VIDEOS_URL,
  VIDEOS_URL_PRE,
  VIDEOS_URL_HELP
} from "../../../common/form/labels";

class AddPerformancesVideosForm extends Component {
  getIntlString = obj => {
    const { intl } = this.props;
    return intl.formatMessage(obj);
  };

  render() {
    const { submitting, handleSubmit, onSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          component={inputText}
          placeholder={this.getIntlString({ id: VIDEOS_NAME })}
        />

        <hr />
        <h3 className="text-center">OR</h3>
        <hr />
        <Field
          name="externalurl"
          component={inputText}
          placeholder={this.getIntlString({ id: VIDEOS_EXTERNALURL })}
        />
        <dl className="row">
          <dt className="col-sm-2">
            <div className="labelField text-muted">Paste examples</div>
            </dt>
            <dd className="col-sm-10 mb-4 text-muted">
              <div><i className="fab fa-vimeo-square mr-3" />https://vimeo.com/158683436</div>
              <div><i className="fab fa-youtube mr-3" />https://www.youtube.com/watch?v=u2vYksfmtJc</div>
              <div><i className="fab fa-instagram mr-3" />https://www.instagram.com/p/B7I57MwIfj6/</div>
              <div><i className="fab fa-facebook-square mr-3" />https://www.facebook.com/avnode.net/videos/1074075152643709/</div>
            </dd>
        </dl>
        <hr />

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-large btn-block"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    );
  }
}

AddPerformancesVideosForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(AddPerformancesVideosForm);

AddPerformancesVideosForm = injectIntl(AddPerformancesVideosForm);

export default AddPerformancesVideosForm;
