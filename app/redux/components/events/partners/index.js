import {h, Component} from 'preact';
import LateralMenu from '../lateralMenu'
import Form from './form'
import {connect} from 'preact-redux';
import {saveModel, fetchModel} from "./actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_ADD_MEDIA, MODAL_SAVED} from "../../modal/constants";
import Loading from '../../loading'
import ErrorMessage from '../../errorMessage'
import ItemNotFound from '../../itemNotFound'
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import {locales, locales_labels} from "../../../../../config/default";
import Table from './table'
import {Button} from 'react-bootstrap';

class EventPartners extends Component {

    componentDidMount() {
        const {fetchModel, _id} = this.props;
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

        const {model, showModal, _id, isFetching, errorMessage} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">EVENT PARTNERS</h1>

                    <br/>

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
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, {_id}) => ({
    model: getModel(state, _id),
    isFetching: getModelIsFetching(state, _id),
    errorMessage: getModelErrorMessage(state, _id),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    saveModel,
    fetchModel,
    showModal
}, dispatch);

EventPartners = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPartners);

export default EventPartners;
