import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import {fetchModel, saveModel} from "./actions";
import ImageForm from '../../image';
import {withRouter} from 'react-router';
import {FormattedMessage} from 'react-intl';
import properties from "../../../../../config/default.json";
import TitleComponent from "../../titleComponent";
import { PERFORMANCE_NAME, SHOW } from "./constants";

class PerformanceImages extends Component {

    render() {

        const {model = {}, isFetching, errorMessage, match: {params: {_id}}, fetchModel, saveModel} = this.props;

        const { components } = properties.cpanel.performances.forms.image;

        return (
            <div>
                <TitleComponent title={model.title} link={"/performances/"+model.slug} show={SHOW} />
                <LateralMenu _id={_id} />
                <hr />
                <h3 className="labelField mb-3">{PERFORMANCE_NAME}</h3>
                <ImageForm
                    model={model}
                    isFetching={isFetching}
                    errorMessage={errorMessage}
                    fetchModel={fetchModel}
                    saveModel={saveModel}
                    id={_id}
                    properties={components}
                />

            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, {match: {params: {_id}}}) => ({
    model: getModel(state, _id),
    isFetching: getModelIsFetching(state, _id),
    errorMessage: getModelErrorMessage(state, _id)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel
}, dispatch);


export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(PerformanceImages));
