import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import Form from './form'
import {showModal} from "../modal/actions";
import Loading from '../loading'
import ErrorMessage from '../errorMessage'
import ItemNotFound from '../itemNotFound';
import {MODAL_ADD_MEDIA, MODAL_REMOVE, MODAL_SAVED} from "../modal/constants";
import {Button, Image} from 'react-bootstrap'
import LightBox from '../lightboxGallery'

class Galleries extends Component {

    componentDidMount() {
        const {fetchModel, match: {params: {_id}}} = this.props;
        fetchModel({
            id: _id
        });
    }

    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {model} = this.props;

        if (!model) {
            return {};
        }

        let v = {};

        v.galleries = model.galleries;

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

    onRemove(photo) {
        const {removeModel} = this.props;

        //dispatch the action to save the model here
        return removeModel(photo)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    renderImage(img, i) {

        const {showModal} = this.props;
        const {image} = img || {};
        const {file} = image;

        return <div className="col-md-6" key={i}>
            <div className="row">
                <div className="col-sm-11">
                    <Image src={file} responsive rounded/>
                </div>
                <div className="col-sm-1">
                    <Button bsStyle="danger"
                            onClick={() =>
                                showModal({
                                    type: MODAL_REMOVE,
                                    props: {
                                        onRemove: () => this.onRemove(img)
                                    }
                                })}
                    >
                        <i className="fa fa-trash" data-toggle="tooltip" data-placement="top"/>
                    </Button>
                </div>
            </div>


            <br/>
        </div>
    }

    render() {

        const {model, showModal, isFetching, errorMessage} = this.props;
        const initialValues = this.getInitialValues();

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Button
                            bsStyle="success"
                            className="pull-right"
                            onClick={() => showModal({
                                type: MODAL_ADD_MEDIA,
                                props: {
                                    onSubmit: this.onSubmit.bind(this)
                                }
                            })}>
                            <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
                        </Button>

                        {!errorMessage && !isFetching && model && Array.isArray(model.galleries) && <LightBox
                            images={model.galleries.map(x => x.image.file)}
                            Button={<Button
                                bsStyle="primary"
                                className="pull-right"
                            >
                                <i className="fa fa-image" data-toggle="tooltip" data-placement="top"/>
                            </Button>}
                        />}

                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <br/>
                        {isFetching && !model && <Loading/>}

                        {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                        {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                        {!errorMessage && !isFetching && model && initialValues && Array.isArray(initialValues.galleries) &&
                        <Form
                            initialValues={initialValues}
                            onSubmit={this.onSubmit.bind(this)}
                            user={model}
                            showModal={showModal}
                            onRemove={this.onRemove.bind(this)}
                        />}

                        {/*
                            {!errorMessage &&
                            !isFetching && model
                            && Array.isArray(model.galleries) &&
                            <div className="row">
                                {model.galleries.map(this.renderImage.bind(this))}
                            </div>}*/}

                    </div>
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, {match: {params: {_id}}}) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
}, dispatch);

Galleries = connect(
    mapStateToProps,
    mapDispatchToProps
)(Galleries);

export default Galleries;
