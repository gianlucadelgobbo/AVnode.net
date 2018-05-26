import React, { Component } from 'react';
import LateralMenu from '../lateralMenu'
import {connect} from 'react-redux'
import {saveModel, fetchModel, removeModel} from "./actions";
import {bindActionCreators} from "redux";
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import {locales, locales_labels} from "../../../../../config/default";
import Partners from '../../partners'

class EventPartners extends Component {

    render() {

        const {model,  match: {params: {_id}}, isFetching, errorMessage,saveModel,removeModel, fetchModel} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">EVENT PARTNERS</h1>

                    <Partners
                        model={model}
                        isFetching={isFetching}
                        errorMessage={errorMessage}
                        removeModel={removeModel}
                        saveModel={saveModel}
                        id={_id}
                        fetchModel={fetchModel}
                    />

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
});

const mapDispatchToProps = dispatch => bindActionCreators({
    saveModel,
    fetchModel,
    removeModel,
}, dispatch);

EventPartners = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPartners);

export default EventPartners;
