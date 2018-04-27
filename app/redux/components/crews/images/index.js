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
import {MODAL_SAVED} from "../../modal/constants";
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class CrewImage extends Component {

    componentDidMount() {
        const {fetchModel, _id} = this.props;
        fetchModel({id:_id});
    }

    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {user} = this.props;

        if (!user) {
            return {};
        }

        let v = {};

        return v;
    }

    onSubmit(values) {
        const {showModal, editUser, user} = this.props;
        const model = this.createModelToSave(values);

        // Add auth user _id
        model._id = user._id;

        console.log("model", model)

        return;

        //dispatch the action to save the model here
        return editUser(model)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    render() {

        const {model, showModal, isFetching, errorMessage, _id} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">MY IMAGE</h1>

                    <br/>
                    {isFetching && !model && <Loading/>}

                    {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                    {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                    {!errorMessage && !isFetching && model && <Form
                        initialValues={this.getInitialValues(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        user={model}
                        showModal={showModal}
                    />}
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
    fetchModel,
    saveModel,
    showModal,
}, dispatch);

CrewImage = connect(
    mapStateToProps,
    mapDispatchToProps
)(CrewImage);

export default CrewImage;
