import {h, Component} from 'preact';
import {connect} from 'preact-redux';
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import Form from './form'
import {showModal} from "../../modal/actions";
import Loading from '../../loading'
import ErrorMessage from '../../errorMessage'
import ItemNotFound from '../../itemNotFound';
import {getDefaultModel} from "../selectors";
import {fetchModel, saveModel} from "./actions";
import {MODAL_ADD_MEDIA, MODAL_SAVED} from "../../modal/constants";
import {getModelIsFetching, getModelErrorMessage} from "../../events/selectors";
import {Button} from 'react-bootstrap'
import LightBox from '../../lightboxGallery'

class EventsImage extends Component {

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

        v.galleries = model.galleries;

        return v;
    }

    onSubmit(values) {

        const {showModal, saveModel, model} = this.props;
        const modelToSave = this.createModelToSave(values);

        // Add auth user _id
        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return saveModel(modelToSave)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    render() {

        const {model, showModal, isFetching, errorMessage, _id} = this.props;
        const initialValues = this.getInitialValues();

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">EVENT IMAGE</h1>

                    <div className="row">
                        <div className="col-md-12">
                            <Button
                                bsStyle="success"
                                className="pull-right"
                                onClick={() => showModal({
                                    type: MODAL_ADD_MEDIA,
                                    props: {
                                        onSubmit: this.onSubmit.bind()
                                    }
                                })}>
                                <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
                            </Button>

                            {!errorMessage && !isFetching && model && Array.isArray(model.galleries) && <LightBox
                                images={model.galleries.map(x => x.image.file)}
                                Button={<Button
                                    bsStyle="primary"
                                    className="pull-right"
                                >
                                    <i className="fa fa-image" data-toggle="tooltip" data-placement="top"/>
                                </Button>}
                            />}

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <br/>
                            {isFetching && !model && <Loading/>}

                            {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                            {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                            {!errorMessage && !isFetching && model && initialValues && Array.isArray(initialValues.galleries) &&
                            <Form
                                initialValues={initialValues}
                                onSubmit={this.onSubmit.bind(this)}
                                user={model}
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
const mapStateToProps = (state) => ({
    model: getDefaultModel(state),
    isFetching: getModelIsFetching(state),
    errorMessage: getModelErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal,
}, dispatch);

EventsImage = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventsImage);

export default EventsImage;
