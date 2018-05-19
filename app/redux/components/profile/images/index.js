import React, { Component } from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import Form from './form'
import {showModal} from "../../modal/actions";
import Loading from '../../loading'
import ErrorMessage from '../../errorMessage'
import {getDefaultModel} from "../selectors";
import {fetchModel, saveModel} from "./actions";
import {MODAL_SAVED} from "../../modal/constants";
import {getErrorMessage, getIsFetching} from "../../events/selectors";
import UserPhotoNotFound from '../../../img/user_photo_not_found.png'
import LightBox from '../../lightboxGallery'

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfileImage extends Component {

    componentDidMount() {
        const {fetchModel} = this.props;
        fetchModel();
    }

    // Convert form values to API model
    createModelToSave(values) {

        const {images} = values;

        let model = {};
        model.image = images[0];

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {model} = this.props;

        if (!model) {
            return {};
        }

        let v = {};

        return v;
    }

    onSubmit(values) {
        const {showModal, saveModel, model} = this.props;
        const modelToSave = this.createModelToSave(values);

        // Add auth user _id
        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return saveModel(modelToSave)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    render() {

        const {model, showModal, isFetching, errorMessage} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu/>
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">MY IMAGE</h1>

                    <br/>
                    {isFetching && !model && <Loading/>}

                    <div className="row">
                        <div className="col-md-6">
                            {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                            {!errorMessage && !isFetching && !model &&
                            <img src={UserPhotoNotFound} className="rounded mx-auto d-block" alt="Photo not found"/>}

                            {!errorMessage &&
                            !isFetching &&
                            model && model.image &&
                            <LightBox images={[model.imageFormats.large]} alt={model.stagename}/>}

                        </div>
                        <div className="col-md-6">
                            <Form
                                initialValues={this.getInitialValues()}
                                onSubmit={this.onSubmit.bind(this)}
                                user={model}
                                showModal={showModal}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    model: getDefaultModel(state),
    isFetching: getIsFetching(state),
    errorMessage: getErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal,
}, dispatch);

ProfileImage = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileImage);

export default ProfileImage;
