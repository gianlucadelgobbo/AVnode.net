import React, {Component} from 'react';
import {connect} from 'react-redux'
import {showModal} from "../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_ADD_MEDIA, MODAL_SAVED} from "../modal/constants";
import Loading from '../loading'
import ErrorMessage from '../errorMessage'
import ItemNotFound from '../itemNotFound'
import {locales, locales_labels} from "../../../../config/default";
import Table from './table'
import {Button} from 'react-bootstrap';

class EventPartners extends Component {

    componentDidMount() {
        const {fetchModel, id} = this.props;
        fetchModel({id});
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

        const {model, showModal, isFetching, errorMessage} = this.props;

        return (
            <div>

                <div className="row">
                    <div className="col-md-12">

                        <Button
                            bsStyle="primary"
                            className="pull-right"
                            onClick={() => showModal({
                                type: MODAL_ADD_MEDIA,
                                props: {
                                    onSubmit: this.onSubmit.bind(this)
                                }
                            })}>
                            <i className="fa fa-cogs" data-toggle="tooltip" data-placement="top"/>
                        </Button>

                        <Button
                            bsStyle="success"
                            className="pull-right"
                            onClick={() => showModal({
                                type: MODAL_ADD_MEDIA,
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

                        {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                        {/*{!errorMessage && !isFetching && model && <Form
                                initialValues={this.getInitialValues()}
                                onSubmit={this.onSubmit.bind(this)}
                                model={model}
                                showModal={showModal}
                                tabs={locales}
                                labels={locales_labels}
                            />}*/}

                        {!errorMessage && !isFetching && model && <Table
                            list={model.partners}
                            showModal={showModal}
                        />}
                    </div>
                </div>

            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal
}, dispatch);

EventPartners = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPartners);

export default EventPartners;
