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
import moment from 'moment';
import {createMultiLanguageInitialObject} from "../../common/form";

class EventPublic extends Component {

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

        // Convert web
        model.categories = model.categories.filter(w => w.url).map(w => ({_id: w.value, name: w.label}));

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

        // Convert web
        model.web = model.web.filter(w => w.url);

        // Convert social
        model.social = model.social.filter(w => w.url);

        // Convert Phone Number
        model.phones = model.phones.filter(a => a).map(p => ({
            url: p.tel
        }));

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {model} = this.props;

        if (!model) {
            return {};
        }

        let v = {};

        // Convert categories
        v.categories = [];
        if (Array.isArray(model.categories)) {
            v.categories = model.categories.map(x => x._id);
        }

        // Convert categories
        v.schedule = [];
        if (Array.isArray(model.schedule)) {

            const createVenue = (v) => {

                const {location = {}, name} = v;
                const {locality, country} = location;
                let venue = "";

                if (name) {
                    venue += name;
                }

                if (locality) {
                    venue += `, ${locality}`;
                }

                if (country) {
                    venue += `, ${country}`;
                }

                return venue;
            };

            v.schedule = model.schedule.map(x => ({
                date: x.date,
                endtime: moment(x.endtime).format('HH:mm'),
                starttime: moment(x.starttime).format('HH:mm'),
                venue: x.venue ? createVenue(x.venue) : "",
                room: x.venue ? x.venue.room : ""
            }));
        }

        //Convert slug for redux-form
        v.slug = model.slug;

        //Convert title for redux-form
        v.title = model.title;

        // Convert about
        v.abouts = createMultiLanguageInitialObject("abouts");

        // Convert subtitles format for FieldArray redux-form
        v.subtitles = createMultiLanguageInitialObject("subtitles");

        // Web: Add one item if value empty
        v.web = (Array.isArray(model.web) && model.web.length > 0) ? model.web : [{url: ""}];

        // Social: Add one item if value empty
        v.social = (Array.isArray(model.social) && model.social.length > 0) ? model.social : [{url: ""}];

        // Emails: Add one item if value empty
        v.emails = (Array.isArray(model.emails) && model.emails.length > 0) ? model.emails : [{text: ""}];

        v.phones = (Array.isArray(model.phones) && model.phones.length > 0) ?
            model.phones.filter(a => a).map(p => ({tel: p.url})) : [""];

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

        const {model, showModal, _id, isFetching, errorMessage, categories} = this.props;

        // console.log("model", model)
        //console.log("this.getInitialValues()", this.getInitialValues())

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">EVENT PUBLIC DATA</h1>

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
    categories: getCategories(state).map(c => ({value: c._id, label: c.name}))
});

const mapDispatchToProps = dispatch => bindActionCreators({
    saveModel,
    fetchModel,
    showModal,
    fetchCategories
}, dispatch);

EventPublic = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPublic);

export default EventPublic;
