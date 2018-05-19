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

class PerformancePublic extends Component {

    componentDidMount() {
        const {fetchModel, _id, fetchCategories} = this.props;
        fetchModel({
            id: _id
        });
        fetchCategories();
    }

    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        //Convert abouts for API
        if (Array.isArray(model.abouts)) {
            model.abouts = model.abouts.map(x => {
                const splitted = x.key.split(".");
                return {
                    lang: splitted[splitted.length - 1],
                    abouttext: x.value
                }
            });
        }
        // Convert tech_req for API
        model.tech_req = model.tech_req.filter(w => w.value);

        
        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {model} = this.props;

        if (!model) {
            return {};
        }

        let v = {};

        //Convert slug for redux-form
        v.slug = model.slug;

        //Convert title for redux-form
        v.title = model.title;

        // Convert about format for FieldArray redux-form
        v.abouts = [];
        if (Array.isArray(model.abouts)) {

            // convert current lang
            v.abouts = model.abouts.map(x => ({
                key: `abouts.${x.lang}`,
                value: x.abouttext
            }));
        }

        locales.forEach(l => {
            let found = v.abouts.filter(o => o.key === `abouts.${l}`).length > 0;
            if (!found) {
                v.abouts.push({
                    key: `abouts.${l}`,
                    value: ""
                })
            }
        });

        v.is_public = model.is_public;
        v.categories = model.categories;
        v.users = model.users || [];
        v.price = model.price;
        v.duration = model.duration;

        // Convert tech_art format for FieldArray redux-form
        v.tech_art = [];
        if (Array.isArray(model.tech_art)) {

            // convert current lang
            v.tech_art = model.tech_art.map(x => ({
                key: `tech_art.${x.lang}`,
                value: x.text
            }));
        }

        locales.forEach(l => {
            let found = v.tech_art.filter(o => o.key === `tech_art.${l}`).length > 0;
            if (!found) {
                v.tech_art.push({
                    key: `tech_art.${l}`,
                    value: ""
                })
            }
        });
        v.tech_req = [];
        if (Array.isArray(model.tech_req)) {

            // convert current lang
            v.tech_req = model.tech_req.map(x => ({
                key: `tech_req.it`,
                value: x
            }));
        }

        locales.forEach(l => {
            let found = v.tech_req.filter(o => o.key === `tech_req.${l}`).length > 0;
            if (!found) {
                v.tech_req.push({
                    key: `tech_req.${l}`,
                    value: ""
                })
            }
        });

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

        const {model, showModal, _id, isFetching, errorMessage, categories} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">PERFORMANCE PUBLIC DATA</h1>

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
const mapStateToProps = (state, {_id}) => ({
    model: getModel(state, _id),
    isFetching: getModelIsFetching(state, _id),
    errorMessage: getModelErrorMessage(state, _id),
    categories: getCategories(state).map(c => ({value:c._id, label:c.name}))
});

const mapDispatchToProps = dispatch => bindActionCreators({
    saveModel,
    fetchModel,
    showModal,
    fetchCategories
}, dispatch);

PerformancePublic = connect(
    mapStateToProps,
    mapDispatchToProps
)(PerformancePublic);

export default PerformancePublic;
