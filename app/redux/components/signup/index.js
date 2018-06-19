import React, { Component } from 'react';
import Form from './form';
import {connect} from 'react-redux';
import {FormattedMessage, injectIntl} from 'react-intl';
import {showModal} from "../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_SAVED} from "../modal/constants";
import {OPTIONS} from "./constants";
import {saveModel} from "./actions";

class SignUp extends Component {
    

    componentDidMount() {
        //const {fetchModel} = this.props;
        //fetchModel();
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

        return v;
    }

    onSubmit(values) {
        const {showModal} = this.props;
        const modelToSave = this.createModelToSave(values);
        console.log(modelToSave);
        // Add auth user _id
        //modelToSave._id = model._id;

        //dispatch the action to save the model here
        return saveModel(modelToSave)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    handleChange(){
        console.log('isOpened');
    }


    render() {

        const {showModal} = this.props;
        const height = 50;
        return (
        
            <div className="row">
                <div className="col-md-12">
                    <Form
                        initialValues={this.getInitialValues()}
                        onSubmit={this.onSubmit.bind(this)}
                        showModal={showModal}
                        options={OPTIONS}
                        onChange={this.handleChange.bind(this)}
                        height={height}
                    />
                </div>
            </div>
        
           
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal
}, dispatch);

SignUp = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp);

export default SignUp;
