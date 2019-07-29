import React, { Component } from "react";
import { reduxForm, Field, FieldArray, getFormSyncErrors } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FORM_NAME, SECTION } from "./constants";
import {
  renderRadioButton,
  inputText,
  textareaMultiTab,
  checkboxField,
  fieldWithLabel
} from "../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import {
  PERFORMANCE_URL,
  PERFORMANCE_URL_PRE,
  PERFORMANCE_URL_HELP,
  TITLE,
  ABOUT,
  IS_PUBLIC,
  CATEGORY,
  AUTHORS,
  PRICE,
  DURATION,
  DURATION_HELP,
  TECHNOLOGIES_ARTISTS,
  TECNICAL_REQUIREMENT
} from "../../common/form/labels";
import { injectIntl } from "react-intl";

class PerformancePublicForm extends Component {
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
      errors,
      categories,
      _id,
      getTechnique,
      handleChange,
      getGenre,
      model,
      selectedType,
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
          placeholder={this.getIntlString({ id: PERFORMANCE_URL })}
          pre={this.getIntlString({ id: PERFORMANCE_URL_PRE })}
          help={this.getIntlString({ id: PERFORMANCE_URL_HELP })}
        />

        <FieldArray
          name="abouts"
          component={textareaMultiTab}
          tabs={tabs}
          labels={labels}
          errors={errors}
          placeholder={this.getIntlString({ id: ABOUT })}
        />

        <br />

        <Field
          name="is_public"
          component={checkboxField}
          placeholder={this.getIntlString({ id: IS_PUBLIC })}
        />

        {/*<Field
                    name="categories"
                    component={renderList}
                    placeholder={this.getIntlString({id:CATEGORY})}
                    multiple={true}
                    options={categories}
                /> */}

        <Field
          name="type"
          component={renderRadioButton}
          placeholder={this.getIntlString({ id: CATEGORY })}
          getTechnique={getTechnique}
          getGenre={getGenre}
          handleChange={handleChange}
          categories={categories}
          errors={errors}
          model={model}
          selectedType={selectedType}
        />

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
          name="price"
          component={inputText}
          placeholder={this.getIntlString({ id: PRICE })}
        /> */}

        <Field
          name="duration"
          component={inputText}
          placeholder={this.getIntlString({ id: DURATION })}
          help={this.getIntlString({ id: DURATION_HELP })}
        />

        <FieldArray
          name="tech_arts"
          component={textareaMultiTab}
          tabs={tabs}
          labels={labels}
          placeholder={this.getIntlString({ id: TECHNOLOGIES_ARTISTS })}
          errors={errors}
        />

        <br />

        <FieldArray
          name="tech_reqs"
          component={textareaMultiTab}
          tabs={tabs}
          labels={labels}
          placeholder={this.getIntlString({ id: TECNICAL_REQUIREMENT })}
          errors={errors}
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

PerformancePublicForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(PerformancePublicForm);

//Get form's initial values from redux state here
const mapStateToProps = state => ({
  errors: getFormSyncErrors(FORM_NAME)(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

PerformancePublicForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformancePublicForm);

PerformancePublicForm = injectIntl(PerformancePublicForm);

export default PerformancePublicForm;
