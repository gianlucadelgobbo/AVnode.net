import React, { Component } from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import { FORM_NAME, SECTION } from "./constants";
import {
  inputText,
  textareaMultiTab,
  fieldWithLabel,
  fieldWithLabelNoModal
} from "../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { injectIntl } from "react-intl";
import {
  ABOUT,
  PLAYLIST_NAME,
  PLAYLIST_URL,
  PLAYLIST_URL_PRE,
  PLAYLIST_URL_HELP,
  AUTHORS,
  FOOTAGE_NAME
} from "../../common/form/labels";

class PlaylistPublicForm extends Component {
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
      model,
      _id,
      removeModel
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          component={inputText}
          placeholder={this.getIntlString({ id: PLAYLIST_NAME })}
        />

        <Field
          name="slug"
          component={inputText}
          placeholder={this.getIntlString({ id: PLAYLIST_URL })}
          pre={this.getIntlString({ id: PLAYLIST_URL_PRE })}
          help={this.getIntlString({ id: PLAYLIST_URL_HELP })}
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
          _id={_id}
          removeModel={removeModel}
          users={model.users}
          SECTION={SECTION}
          param="stagename"
        />

        <br />

        <FieldArray
          name="footage"
          component={fieldWithLabel}
          placeholder={this.getIntlString({ id: FOOTAGE_NAME })}
          showModal={showModal}
          _id={_id}
          removeModel={removeModel}
          users={model.footage}
          SECTION={SECTION}
          hidemodal={true}
          param="title"
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

PlaylistPublicForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(PlaylistPublicForm);

PlaylistPublicForm = injectIntl(PlaylistPublicForm);

export default PlaylistPublicForm;
