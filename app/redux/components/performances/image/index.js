import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import {getModel, getErrorMessage, getIsFetching} from "../selectors";
import {fetchModel, saveModel} from "./actions";
import ImageForm from '../../image';
import {withRouter} from 'react-router';

class PerformanceImages extends Component {

    render() {

        const {model, isFetching, errorMessage, match: {params: {_id}}, fetchModel, saveModel} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h2 className="labelField">MY IMAGE</h2>

                    <br/>

                    <ImageForm
                        model={model}
                        isFetching={isFetching}
                        errorMessage={errorMessage}
                        fetchModel={fetchModel}
                        saveModel={saveModel}
                        id={_id}
                    />

                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, {match: {params: {_id}}}) => ({
    model: getModel(state, _id),
    isFetching: getIsFetching(state),
    errorMessage: getErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel
}, dispatch);


export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(PerformanceImages));
