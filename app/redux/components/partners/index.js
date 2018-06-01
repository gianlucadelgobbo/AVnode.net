import React, {Component} from 'react';
import {connect} from 'react-redux'
import {showModal} from "../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_ADD_PARTNER, MODAL_SAVED} from "../modal/constants";
import Loading from '../loading'
import ErrorMessage from '../errorMessage'
import ItemNotFound from '../itemNotFound'
import Form from './form'
import {Button} from 'react-bootstrap';
import {fetchList as fetchCategories} from "../partnerCategories/actions";
import {getList as getCategories} from "../partnerCategories/selectors";

class Partners extends Component {

    normalizeData() {

        const {model} = this.props;

        if (!model || !Array.isArray(model.partners)) {
            return [];
        }

        let list = model.partners;
        let result = [];

        list.forEach(item => {
            let {users, category} = item;
            users.forEach(u => {
                u.category = category;
                result.push(u)
            })

        });

        return result;

    }

    componentDidMount() {
        const {fetchModel, id, fetchCategories} = this.props;
        fetchModel({id});
        fetchCategories()
    }

    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {

        let v = {};

        let p = this.normalizeData();
        v.partners = p.map(c => {
            let {category} = c;
            let result = {};
            result.category = {
                value: category._id,
                label: category.name
            };

            return result;
        });

        return v;
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

        const {model, showModal, isFetching, errorMessage, categories} = this.props;
        const data =  this.normalizeData();

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">

                        <Button
                            bsStyle="success"
                            className="pull-right"
                            onClick={() => showModal({
                                type: MODAL_ADD_PARTNER,
                                props: {
                                    onSubmit: this.onSubmit.bind(this)
                                }
                            })}>
                            <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
                        </Button>

                    </div>
                </div>

                <br/>

                <div className="row">
                    <div className="col-md-12">

                        {isFetching && !model && <Loading/>}

                        {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                        {!errorMessage && !isFetching && !data.length && <ItemNotFound/>}

                        {!errorMessage && !isFetching && model && <Form
                            showModal={showModal}
                            initialValues={this.getInitialValues()}
                            data={data}
                            categories={categories}
                        />}
                    </div>
                </div>

            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    categories: getCategories(state).map(c => ({label: c.name, value: c._id}))
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
    fetchCategories
}, dispatch);

Partners = connect(
    mapStateToProps,
    mapDispatchToProps
)(Partners);

export default Partners;
