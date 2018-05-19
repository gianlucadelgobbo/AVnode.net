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
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import {fetchList as fetchCountries} from '../../countries/actions'
import {getList as getCountries} from '../../countries/selectors'
import {MODAL_SAVED} from "../../modal/constants";
import {getErrorMessage, getIsFetching} from "../../events/selectors";
/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class CrewMembers extends Component {


    componentDidMount() {
        const {fetchModel, _id} = this.props;
        fetchModel({id:_id});
    }


    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        // Convert Addresses_private
        model.addresses_private = model.addresses_private.map(a => {
            const originalString = a.formatted_address;
            return {formatted_address: originalString};
        });
        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {user} = this.props;

        if (!user) {
            return {};
        }

        let v = {};
        //Convert name for redux-form
        v.member = user.member;
        // Addresses_private: Add one item if value empty
        v.addresses_private = (Array.isArray(user.addresses_private) && user.addresses_private.length > 0) ?
            user.addresses_private : [{formatted_address: ""}];
    
        return v;
    }

    onSubmit(values) {
        const {showModal, editUser, user} = this.props;
        const model = this.createModelToSave(values);
        console.log(model);

        // Add auth user _id
        model._id = user._id;

        //dispatch the action to save the model here
        return editUser(model)
            .then(() => {
                showModal({
                     type: MODAL_SAVED
                });
            });
    }

    render() {

        const {model, showModal, errorMessage, isFetching, _id} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">
                        <FormattedMessage
                            id="myAccountMembersData"
                            defaultMessage="My Account Members data"
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
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal
}, dispatch);

CrewMembers = connect(
    mapStateToProps,
    mapDispatchToProps
)(CrewMembers);

export default CrewMembers;
