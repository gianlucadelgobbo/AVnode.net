import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import Form from './form'
import {connect} from 'react-redux'
import {fetchModel, saveModel} from "./actions";
import {showModal} from "../../modal/actions";
import Loading from '../../loading'
import ErrorMessage from '../../errorMessage'
import ItemNotFound from '../../itemNotFound';
import {getDefaultModel} from "../selectors";
import {fetchList as fetchCountries} from '../../countries/actions'
import {getList as getCountries} from '../../countries/selectors'
import {MODAL_SAVED} from "../../modal/constants";
import {getErrorMessage, getIsFetching} from "../../events/selectors";
import moment from 'moment';

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfilePrivate extends Component {


    componentDidMount() {
        const {fetchModel, fetchCountries} = this.props;
        fetchModel();
        fetchCountries();
    }

    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        //convert Gender
        model.gender = values.gender.value;
        //convert Lang
        model.lang = values.lang.value;
        //convert Birthday
        model.birthday = moment(values.birthday).utc();
        // Convert citizenship
        model.citizenship = model.citizenship.filter(a => a).map(a => a.value);
        // Convert addresses_private
        model.addresses_private = model.addresses_private.map(a => {
            const originalString = a.text;
            const split = originalString.split(",");
            const country = split[split.length - 1].trim();
            const street = split[0].trim();
            const locality = split[1].trim();
            return {originalString, street, locality, country}
        });
        // Convert Phone Number
        model.phone = model.phone.filter(a => a).map(p => ({
            url: p.tel
        }));
        // Convert mobile Number
        model.mobile = model.mobile.filter(a => a).map(p => ({
            url: p.tel
        }));
        // Convert skype
        model.skype = model.skype.filter(a => a).map(p => ({
            url: p.text
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
        //Convert name for redux-form
        v.name = model.name;
        //Convert surname for redux-form
        v.surname = model.surname;
        //Convert gender for redux-form
        v.gender = model.gender ? model.gender : "";
        //Convert language preferred for redux-form
        v.lang = model.lang ? model.lang : "";
        //Convert birthday for redux-form
        v.birthday = model.birthday;
        //Convert citizenship for redux-form
        v.citizenship = model.citizenship ? model.citizenship : "";
        // Addresses_private: Add one item if value empty
        v.addresses_private = (Array.isArray(model.addresses_private) && model.addresses_private.length > 0) ?
            model.addresses_private.map(a => ({
                text: `${a.locality}, ${a.country}`
            })) :
            [{text: ""}];
        // Phone: Add one item if value empty
        v.phone = (Array.isArray(model.phone) && model.phone.length > 0) ?
            model.phone.filter(a => a).map(p => ({tel: p.url})) : [""];
        // Mobile: Add one item if value empty
        v.mobile = (Array.isArray(model.mobile) && model.mobile.length > 0) ?
            model.phone.filter(a => a).map(p => ({tel: p.url})) : [""];
        //Convert skype for redux-form
        v.skype = (Array.isArray(model.skype) && model.skype.length > 0) ?
            model.skype.filter(a => a).map(p => ({text: p.url})) : [""];

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
        const {model, countries, showModal, errorMessage, isFetching} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu/>
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">
                        <FormattedMessage
                            id="myAccountPrivateData"
                            defaultMessage="My Account Private data"
                        />
                    </h1>

                    <br/>

                    {isFetching && !model && <Loading/>}

                    {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                    {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                    {!errorMessage && !isFetching && model && <Form
                        initialValues={this.getInitialValues(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        user={model}
                        showModal={showModal}
                        countries={countries}
                    />}
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    model: getDefaultModel(state),
    countries: getCountries(state),
    isFetching: getIsFetching(state),
    errorMessage: getErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal,
    fetchCountries
}, dispatch);

ProfilePrivate = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePrivate);

export default ProfilePrivate;
