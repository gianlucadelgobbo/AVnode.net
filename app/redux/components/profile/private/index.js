import {h, render, Component} from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Navbar from '../navbar'
import Form from './form'
import {connect} from 'preact-redux';
import {getUser} from './selectors'
import {locales, locales_labels} from '../../../../../config/default.json'
import {editUser, fetchCountries} from "../../../reducers/actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfilePrivate extends Component {

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
        const {showModal, editUser, user, fetchCountries} = this.props;
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
                <div className="class-md-3">
                    <Navbar/>
                </div>
                <div className="class-md-9">
                    <h1>
                        <FormattedMessage
                        id="myAccountPrivateData"
                        defaultMessage="My Account Private data"
                        />
                    </h1>
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

ProfilePrivate = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePrivate);

export default ProfilePrivate;
