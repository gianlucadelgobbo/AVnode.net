import {h, render, Component} from 'preact';
import Navbar from '../navbar'
import Form from './form'
import {connect} from 'preact-redux';
import {getUser} from './selectors'
import {locales, locales_labels} from '../../../../../config/default.json'
import {editUser} from "./actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfileEmail extends Component {

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
        editUser(model)
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
                    <Navbar/>
                </div>
                <div className="col-md-10">
                    <h1>MY EMAIL</h1>

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

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    user: getUser(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    editUser: editUser,
    showModal: showModal
}, dispatch);

ProfileEmail = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileEmail);

export default ProfileEmail;
