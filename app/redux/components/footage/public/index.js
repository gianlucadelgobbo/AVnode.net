import React, {Component} from 'react';
import LateralMenu from '../lateralMenu';
import Form from './form';
import {connect} from 'react-redux';
import {saveModel, fetchModel} from "./actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_SAVED} from "../../modal/constants";
import Loading from '../../loading';
import ErrorMessage from '../../errorMessage';
import ItemNotFound from '../../itemNotFound';
import TitleComponent from '../../titleComponent';
import {FOOTAGE_NAME} from './constants';
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import {locales, locales_labels} from "../../../../../config/default";

class FootagePublic extends Component {

    componentDidMount() {
        const {fetchModel, match: {params: {_id}}} = this.props;
        fetchModel({
            id: _id
        });
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
        console.log(model);

        if (!model) {
            return {};
        }

        let f = {}

        //Convert slug for redux-form
        f.slug = model.slug;
        //Convert stagename
        f.title = model.title;

        // Convert about format for FieldArray redux-form
        f.abouts = [];
        if (Array.isArray(model.abouts)) {

            // convert current lang
            f.abouts = model.abouts.map(x => ({
                key: `abouts.${x.lang}`,
                value: x.abouttext
            }));
        }

        locales.forEach(l => {
            let found = f.abouts.filter(o => o.key === `abouts.${l}`).length > 0;
            if (!found) {
                f.abouts.push({
                    key: `abouts.${l}`,
                    value: ""
                })
            }
        });

        return f;
    }

    onSubmit(values) {
        const {showModal, saveModel, model} = this.props;
        const modelToSave = this.createModelToSave(values);

        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return saveModel(model)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    render() {

        const {model, showModal, match: {params: {_id}}, isFetching, errorMessage} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    
                    {isFetching && !model && <Loading/>}

                    {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                    {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                    {!errorMessage && !isFetching && model && <TitleComponent
                        title={model.title}
                        type={FOOTAGE_NAME}
                    />
                    }

                    {!errorMessage && !isFetching && model && <Form
                         initialValues={this.getInitialValues()}
                         onSubmit={this.onSubmit.bind(this)}
                         model={model}
                         showModal={showModal}
                         tabs={locales}
                         labels={locales_labels}
                    />}
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
    showModal,
}, dispatch);

FootagePublic = connect(
    mapStateToProps,
    mapDispatchToProps
)(FootagePublic);

export default FootagePublic;
