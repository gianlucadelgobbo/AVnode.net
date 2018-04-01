import {h, Component} from 'preact';
import Form from './form'
import {connect} from 'preact-redux';
import {getModel} from '../selectors'
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_SAVED} from "../../modal/constants";
import {saveModel} from '../actions'

class AddPerformance extends Component {

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
        const {showModal, saveModel} = this.props;
        const modelToSave = this.createModelToSave(values);

        //dispatch the action to save the model here
        return saveModel(modelToSave)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    render() {

        const {showModal} = this.props;

        return (

            <div className="row">
                <div className="col-md-12">
                    <Form
                        initialValues={this.getInitialValues()}
                        onSubmit={this.onSubmit.bind(this)}
                        showModal={showModal}
                    />
                </div>
            </div>

        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    model: getModel(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
    saveModel
}, dispatch);

AddPerformance = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddPerformance);

export default AddPerformance;
