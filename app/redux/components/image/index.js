import React, { Component } from "react";
import Form from "./form";
import { showModal } from "../modal/actions";
import Loading from "../loading";
import ErrorMessage from "../errorMessage";
import { MODAL_SAVED } from "../modal/constants";
import UserPhotoNotFound from "../../img/user_photo_not_found.png";
import LightBox from "../lightboxGallery";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class Image extends Component {
  componentDidMount() {
    const { fetchModel, id } = this.props;
    fetchModel({ id });
  }

  // Convert form values to API model
  createModelToSave(values) {
    const { images } = values;

    let model = {};
    model.image = images[0];

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model } = this.props;

    if (!model) {
      return {};
    }

    let v = {};

    return v;
  }

  onSubmit(values) {
    const { showModal, saveModel, model } = this.props;
    const modelToSave = this.createModelToSave(values);

    // Add auth user _id
    modelToSave.id = model._id;

    //dispatch the action to save the model here
    return saveModel(modelToSave).then(model => {
      if (model && model.id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }

  render() {
    const { model = {}, showModal, isFetching, errorMessage, properties } = this.props;

    return (
      <div>
        <br />
        {isFetching && !model && <Loading />}

        <div className="row">
          <div className="col-md-6">
            {errorMessage && <ErrorMessage errorMessage={errorMessage.message} />}

            {!errorMessage &&
              !isFetching &&
              !model && (
                <img
                  src={UserPhotoNotFound}
                  className="rounded mx-auto d-block"
                  alt="Photo not found"
                />
              )}

            {!errorMessage &&
              !isFetching &&
              model &&
              model.image && (
                <LightBox
                  images={[model.imageFormats.large || UserPhotoNotFound]}
                  alt={model.stagename}
                />
              )}
          </div>
          <div className="col-md-6">
            <Form
              initialValues={this.getInitialValues()}
              onSubmit={this.onSubmit.bind(this)}
              user={model}
              showModal={showModal}
              properties={properties}
            />
          </div>
        </div>
      </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModal
    },
    dispatch
  );

Image = connect(
  mapStateToProps,
  mapDispatchToProps
)(Image);

export default Image;
