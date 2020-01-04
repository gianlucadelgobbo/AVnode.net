import React, { Component } from 'react';
import LateralMenu from '../lateralMenu'
import Form from './form'
import {connect} from 'react-redux'
import {saveModel, fetchModel} from "./actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_SAVED} from "../../modal/constants";
import Loading from '../../loading'
import ErrorMessage from '../../errorMessage'
import ItemNotFound from '../../itemNotFound'
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import {locales, locales_labels} from "../../../../../config/default";
import {fetchList as fetchEventsCategories} from "../../categories/actions";
import {getList as getCategories} from "../../categories/selectors";
import {FormattedMessage} from 'react-intl';
import { EVENT_NAME, SHOW } from "./constants";
import TitleComponent from "../../titleComponent";

class EventProgram extends Component {

    componentDidMount() {
        const {fetchModel, match: {params: {_id}}, fetchEventsCategories} = this.props;
        fetchModel({
            id: _id
        });
        fetchEventsCategories();

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

        v.program = (Array.isArray(model.program) && model.program.length > 0) ?
            model.program.filter(a => a).map(p => ({text: p.url})) : [{}];

        return v;
    }

    onSubmit(values) {
        const {showModal, saveModel, model} = this.props;
        const modelToSave = this.createModelToSave(values);

        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return saveModel(model)
            .then((model) => {
                if(model && model.id){
                    showModal({
                        type: MODAL_SAVED
                    });
                }
            });
    }

    render() {

        const {model={}, showModal, match: {params: {_id}}, isFetching, errorMessage, categories} = this.props;

        return (
            <div>
                <TitleComponent title={model.title} link={"/events/"+model.slug} show={SHOW} />
                <LateralMenu _id={_id} />
                <hr />
                <h3 className="labelField mb-3">{EVENT_NAME}</h3>
        
        
                {isFetching && !model && <Loading/>}

                {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                <Form
                    initialValues={this.getInitialValues()}
                    onSubmit={this.onSubmit.bind(this)}
                    model={model}
                    showModal={showModal}
                    tabs={locales}
                    labels={locales_labels}
                    categories={categories}
                />
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, {match: {params: {_id}}}) => ({
    model: getModel(state, _id),
    isFetching: getModelIsFetching(state, _id),
    errorMessage: getModelErrorMessage(state, _id),
    categories: getCategories(state).map(c => ({value: c._id, label: c.name}))
});

const mapDispatchToProps = dispatch => bindActionCreators({
    saveModel,
    fetchModel,
    showModal,
    fetchEventsCategories
}, dispatch);

EventProgram = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventProgram);

export default EventProgram;
