import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import Form from '../../image/form'
import {showModal} from "../../modal/actions";
import {getDefaultModel} from "../selectors";
import {fetchModel, saveModel} from "./actions";
import {getErrorMessage, getIsFetching} from "../../events/selectors";


import ImageForm from '../../image'

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfileImage extends Component {


    render() {

        const {model, isFetching, errorMessage, fetchModel, saveModel} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu/>
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">MY IMAGE</h1>

                    <br/>

                    <ImageForm
                        model={model}
                        isFetching={isFetching}
                        errorMessage={errorMessage}
                        fetchModel={fetchModel}
                        saveModel={saveModel}
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
    errorMessage: getErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal,
}, dispatch);

ProfileImage = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileImage);

export default ProfileImage;
