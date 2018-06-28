import React, { Component } from 'react';
import LateralMenu from '../lateralMenu';
import Form from './form';
import {connect} from 'react-redux';
import {getDefaultModel, getDefaultModelErrorMessage, getIsFetching} from '../selectors';
import {locales, locales_labels} from '../../../../../config/default.json'
import {saveModel, fetchModel} from "./actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import Loading from '../../loading';
import ErrorMessage from '../../errorMessage';
import ItemNotFound from '../../itemNotFound';
import TitleComponent from '../../titleComponent';
import {PROFILE_NAME} from './constants';
import {MODAL_SAVED} from "../../modal/constants";
import {sortByLanguage} from "../../common/form";
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import axios from 'axios';
/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfilePublic extends Component {

    componentDidMount() {
        const {fetchModel} = this.props;
        fetchModel();
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

        // Convert web
        model.web = model.web.filter(w => w.url);

        // Convert social
        model.social = model.social.filter(w => w.url);

        // Convert addresses
        model.addresses = model.addresses.map(a => {
            const originalString = a.text;
            const split = originalString.split(",");
            const country = split[split.length - 1].trim();
            const locality = split[0].trim();
            const geometry = a.geometry;
            return {originalString, locality, country, geometry}
        });

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {model} = this.props;

        if (!model) {
            return {};
        }

        let v = {};

        //Convert stagename for redux-form
        v.stagename = model.stagename;

        //Convert slug for redux-form
        v.slug = model.slug;

        // Convert about format for FieldArray redux-form
        v.abouts = [];
        if (Array.isArray(model.abouts)) {

            // convert current lang
            v.abouts = model.abouts.map(x => ({
                key: `abouts.${x.lang}`,
                value: x.abouttext,
                lang: x.lang
            }));
        }
        locales.forEach(l => {
            let found = v.abouts.filter(o => o.key === `abouts.${l}`).length > 0;
            if (!found) {
                v.abouts.push({
                    key: `abouts.${l}`,
                    value: "",
                    lang : l
                })
            }
        });
        v.abouts = sortByLanguage(v.abouts);

        // Social: Add one item if value empty
        v.social = (Array.isArray(model.social) && model.social.length > 0) ? model.social : [{url: ""}];

        // Web: Add one item if value empty
        v.web = (Array.isArray(model.web) && model.web.length > 0) ? model.web : [{url: ""}];

        // Addresses: Add one item if value empty
        v.addresses = (Array.isArray(model.addresses) && model.addresses.length > 0) ?
            model.addresses.map(a => ({
                text: `${a.locality}, ${a.country}`
            })) :
            [{text: ""}];

        return v;
    }

    createLatLongToSave = (address) => {
        return geocodeByAddress(address)
        .then(results => getLatLng(results[0]))

    }

    onSubmit(values) {
        const {showModal, saveModel, model} = this.props;
    
        let promises = []

        const addrs = values.addresses;

        addrs.forEach(a => {
            promises.push(this.createLatLongToSave(a.text).then((result) => {
                 // add to a model
                 a.geometry = result;
                }))
        });

        return axios.all(promises).then(() => {
            //dispatch the action to save the model here
            const modelToSave = this.createModelToSave(values);

            modelToSave._id = model._id;

            return saveModel(modelToSave)
            .then((model) => {
                if (model && model.id){
                    showModal({
                        type: MODAL_SAVED
                    });
                }
            });
        });

    }

    render() {

        const {model = {}, showModal, isFetching, errorMessage} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu/>
                </div>
                <div className="col-md-10">
                    {/*<h1 className="labelField">MY ACCOUNT PUBLIC DATA</h1>
                    <br/>*/}

                    {isFetching && !model && <Loading/>}

                    {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                    {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                     <TitleComponent
                        title={model.stagename}
                        type={PROFILE_NAME}
                    />

                    <Form
                        initialValues={this.getInitialValues()}
                        onSubmit={this.onSubmit.bind(this)}
                        tabs={locales}
                        labels={locales_labels}
                        showModal={showModal}
                        //handleSelect={this.createLatLongToSave()}
                    />
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    model: getDefaultModel(state),
    isFetching: getIsFetching(state),
    errorMessage: getDefaultModelErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    saveModel,
    fetchModel,
    showModal
}, dispatch);

ProfilePublic = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePublic);

export default ProfilePublic;
