import {h, render, Component} from 'preact';
import Form from './form'
import {connect} from 'preact-redux';
import {getUser} from './selectors'
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_SAVED} from "../../modal/constants";
class AddEvent extends Component {

    // Convert form values to API model
    createUserModel(values) {

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
        const model = this.createUserModel(values);

        // Add auth user _id
        model._id = user._id;

        //dispatch the action to save the model here
        return editUser(model)
            .then(() => {
                showModal({
                     type: MODAL_SAVED
                });
            });
    }

    render() {

        const {user, showModal} = this.props;

        return (
            <div className="row">
                <div className="col-md-12">
                    <Form
                        initialValues={this.getInitialValues()}
                        onSubmit={this.onSubmit.bind(this)}
                        user={user}
                        showModal={showModal}
                    />
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    user: getUser(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal: showModal
}, dispatch);

AddEvent = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEvent);

export default AddEvent;
