import React, { Component } from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import { FORM_NAME, SECTION } from "./constants";
import {
  renderList,
  inputText,
  textareaMultiTab,
  fieldWithLabel,
  checkboxField
} from "../../common/form/components";
import validate from "./validate";
import { injectIntl } from "react-intl";
import {
  CATEGORY_VJTV,
  CATEGORY_VJTV_NO_EXTERNAL,
  ABOUT,
  VIDEOS_NAME,
  VIDEOS_URL,
  VIDEOS_URL_PRE,
  VIDEOS_URL_HELP,
  AUTHORS,
  IS_PUBLIC
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
      categories,
      _id,
      removeModel,
      model,
      media
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          component={inputText}
          placeholder={this.getIntlString({ id: VIDEOS_NAME })}
        />

        <Field
          name="slug"
          component={inputText}
          placeholder={this.getIntlString({ id: VIDEOS_URL })}
          pre={this.getIntlString({ id: VIDEOS_URL_PRE })}
          help={this.getIntlString({ id: VIDEOS_URL_HELP })}
        />
        
        <div className="vjtv">
          {media.iframe ?
            <dl className="row">
              <dt className="col-sm-2">
                <div class="labelField">VJTV Category</div>
                <div className="labelADD">
                  <a href="https://vjtelevision.com" target="_blank">
                    <img src="/images/VJTV.png" />
                  </a>
                </div>
              </dt>
              <dd className="col-sm-10 h3"><b>{this.getIntlString({ id: CATEGORY_VJTV_NO_EXTERNAL })}</b></dd>
            </dl> :
          <Field
            name="categories"
            component={renderList}
            placeholder={this.getIntlString({ id: CATEGORY_VJTV })}
            multiple={false}
            options={categories}
            labeladd={
              <div className="labelADD">
                <a href="https://vjtelevision.com" target="_blank">
                  <img src="/images/VJTV.png" />
                </a>
              </div>
            }
          />}
        </div>

        <Field
          name="is_public"
          component={checkboxField}
          placeholder={this.getIntlString({ id: IS_PUBLIC })}
        />
        <br />

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
