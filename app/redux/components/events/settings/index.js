import React, { Component } from 'react';
import LateralMenu from '../lateralMenu'
import Form from './form'
import {connect} from 'react-redux'
import {saveModel, fetchModel} from "./actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_SAVED} from "../../modal/constants";
import Loading from '../../loading'
import ErrorMessage from '../../errorMessage'
import ItemNotFound from '../../itemNotFound'
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import {FormattedMessage} from 'react-intl';
import { EVENT_NAME, SHOW } from "./constants";
import TitleComponent from "../../titleComponent";

class EventPublic extends Component {

    componentDidMount() {
        const {fetchModel, match: {params: {_id}}} = this.props;
        fetchModel({
            id: _id
        });
    }

    // Convert form values to API model
    createModelToSave(values) {

        const {model} = this.props;

        //clone obj
        let toSave = Object.assign({}, model);
        toSave.settings = Object.assign(toSave.settings, values);

        return toSave;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {model} = this.props;

        if (!model) {
            return {};
        }

        let v = {};

        //Convert stagename for redux-form
        v.is_public = model.is_public;
        // v.gallery_is_public = model.gallery_is_public;
        // v.is_freezed = model.is_freezed;
        //
        // v.users = model.users; //TO DO
        //
        // v.program_builder = model.program_builder;
        // v.advanced_proposals_manager = model.advanced_proposals_manager;
        // v.call_manager = model.call_manager;

        return v;
    }

    onSubmit(values) {
        const {showModal, saveModel, model} = this.props;
        const modelToSave = this.createModelToSave(values);

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

        const {model = {}, showModal, match: {params: {_id}}, isFetching, errorMessage} = this.props;

        return (
            <div>
                <TitleComponent title={model.title} link={"/events/"+model.slug} show={SHOW} />
                <LateralMenu _id={_id} />
                <hr />
                <h3 className="labelField mb-3">{EVENT_NAME}</h3>
    
    
                {isFetching && !model && <Loading/>}

                {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                {!errorMessage && !isFetching && model && <Form
                    initialValues={this.getInitialValues()}
                    onSubmit={this.onSubmit.bind(this)}
                    model={model}
                    showModal={showModal}
                />}
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, {match: {params: {_id}}}) => ({
    model: getModel(state, _id),
    isFetching: getModelIsFetching(state, _id),
    errorMessage: getModelErrorMessage(state, _id),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    saveModel,
    fetchModel,
    showModal
}, dispatch);

EventPublic = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPublic);

export default EventPublic;
