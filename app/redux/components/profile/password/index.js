import {h, render, Component} from 'preact';
import ProfileLateralMenu from '../lateralMenu'
import Form from './form'
import {connect} from 'preact-redux';
import {getUser} from './selectors'
import {locales, locales_labels} from '../../../../../config/default.json'
import {editUser} from "../../../reducers/actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfilePassword extends Component {

    // Convert form values to API model
    createUserModel(values) {

        let model = {};

        // Pass only 'password' to API
        model.password = values.password;

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
                    type: "SAVED"
                });
            });
    }

    render() {

        const {user} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <ProfileLateralMenu/>
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">MY Password</h1>

                    <br/>
                    <Form
                        initialValues={this.getInitialValues(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        user={user}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: getUser(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    editUser: editUser,
    showModal: showModal
}, dispatch);

ProfilePassword = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePassword);

export default ProfilePassword;
