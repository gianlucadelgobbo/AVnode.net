import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import {getModel} from "../selectors";
import {fetchModel, saveModel, removeModel} from "./actions";
import {getModelIsFetching, getModelErrorMessage} from "../../events/selectors";
import Galleries from '../../galleries';
import {PERFORMANCE_NAME} from '../constants';
import TitleComponent from '../../titleComponent';

class PerformanceGallery extends Component {

    render() {

        const {model, isFetching, errorMessage, match: {params: {_id}}, saveModel, removeModel, fetchModel} = this.props;
        console.log(model);
        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                   
                    <h2 className="labelField">PERFORMANCE GALLERY</h2>

                    <Galleries
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
    isFetching: getModelIsFetching(state),
    errorMessage: getModelErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    removeModel
}, dispatch);

PerformanceGallery = connect(
    mapStateToProps,
    mapDispatchToProps
)(PerformanceGallery);

export default PerformanceGallery;
