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
import {locales, locales_labels} from "../../../../../config/default";
import {fetchList as fetchCategories} from "../../categories/actions";
import {getList as getCategories} from "../../categories/selectors";
import {createMultiLanguageInitialObject} from "../../common/form";

class EventCalls extends Component {

    componentDidMount() {
        const {fetchModel, match: {params: {_id}}, fetchCategories} = this.props;
        fetchModel({
            id: _id
        });
        fetchCategories();
    }

    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

   
    getInitialModel() {

        let v = {};
        v.excerpt = createMultiLanguageInitialObject("excerpt");
        v.terms = createMultiLanguageInitialObject("terms");
        v.closedcalltext = createMultiLanguageInitialObject("closedcalltext");

        let p = {};
        p.description = createMultiLanguageInitialObject("description");
        v.packages = [p];

        let t = {};
        t.description = createMultiLanguageInitialObject("description");
        v.topics = [t];

        return v;

    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {model} = this.props;

        if (!model) {
            return {};
        }

        let v = {};

        v.calls = (Array.isArray(model.calls) && model.calls.length > 0) ?
            model.calls.filter(a => a).map(p => ({text: p.url})) : [this.getInitialModel()];

        return v;
    }

    onSubmit(values) {
        const {showModal, saveModel, model} = this.props;
        const modelToSave = this.createModelToSave(values);

        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return saveModel(model)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    render() {

        const {model, showModal, match: {params: {_id}}, isFetching, errorMessage, categories} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">EVENT CALLS</h1>

                    <br/>

                    {isFetching && !model && <Loading/>}

                    {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                    {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                    {!errorMessage && !isFetching && model && <Form
                        initialValues={this.getInitialValues()}
                        onSubmit={this.onSubmit.bind(this)}
                        model={model}
                        showModal={showModal}
                        tabs={locales}
                        labels={locales_labels}
                        categories={categories}
                    />}
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, {match: {params: {_id}}}) => ({
    model: getModel(state, _id),
    isFetching: getModelIsFetching(state, _id),
    errorMessage: getModelErrorMessage(state, _id),
    categories: getCategories(state).map(c => ({value: c._id, label: c.name})),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    saveModel,
    fetchModel,
    showModal,
    fetchCategories
}, dispatch);

EventCalls = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventCalls);

export default EventCalls;
