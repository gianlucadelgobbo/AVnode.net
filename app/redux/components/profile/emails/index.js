import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu';
import Form from './form';
import {showModal} from "../../modal/actions";
import Loading from '../../loading';
import ErrorMessage from '../../errorMessage';
import ItemNotFound from '../../itemNotFound';
import {fetchModel, saveModel} from "./actions";
import {MODAL_SAVED} from "../../modal/constants";
import {getDefaultModel, getErrorMessage, getIsFetching} from "../selectors";
import {FormattedMessage} from 'react-intl';

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfileEmails extends Component {

    componentDidMount() {
        const {fetchModel} = this.props;
        fetchModel();
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

        // convert Emails for redux-form
        v.emails = (Array.isArray(model.emails) && model.emails.length > 0) ?
            model.emails :
            [{}];

        return v;
    }

    onSubmit(values) {
        const {showModal, saveModel, model} = this.props;
        const modelToSave = this.createModelToSave(values);

        // Add auth user _id
        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return saveModel(modelToSave)
            .then((model) => {
                if(model && model.id){
                    showModal({
                        type: MODAL_SAVED
                    });
                }
            });
    }

    render() {

        const {model={}, showModal, isFetching, errorMessage} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu/>
                </div>
                <div className="col-md-10">
                    <h2 className="labelField">
                        <FormattedMessage
                            id="AccountPublicEmail"
                            defaultMessage="MY EMAIL"
                        />
                    </h2>

                    <br/>

                    {isFetching && !model && <Loading/>}

                    {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                    {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                    <Form
                        initialValues={this.getInitialValues()}
                        onSubmit={this.onSubmit.bind(this)}
                        showModal={showModal}
                    />}
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
    showModal
}, dispatch);

ProfileEmails = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileEmails);

export default ProfileEmails;
