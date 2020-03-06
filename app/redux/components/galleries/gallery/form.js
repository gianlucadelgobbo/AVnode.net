import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { uploadGallery } from "../../common/form/components";

class GalleriesGalleryForm extends Component {
  render() {
    const {
      submitting,
      handleSubmit,
      showModal,
      onSubmit,
      onRemove,
      uploadFile,
      loaded,
      media
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
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
          onRemove={onRemove}
          icon="video"
          loaded={loaded}
        />
        <hr />

        {/*<button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-lg btn-block"
        >
          {submitting ? "Saving..." : "Save"}
        </button>*/}
      </form>
    );
  }
}

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate
})(GalleriesGalleryForm);
