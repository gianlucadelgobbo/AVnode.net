import {h, render, Component} from 'preact';
import {FormattedMessage} from 'preact-intl';
import Navbar from '../navbar'
import Form from './form'
import {connect} from 'preact-redux';
import {getUser} from './selectors';
import {locales_labels} from '../../../../../config/languages.json';
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

        //convert Gender
        model.gender = values.gender.value;
        //convert Lang
        model.lang = values.lang.value;
        // Convert Addresses_private
        model.addresses_private = model.addresses_private.map(a => {
            const originalString = a.formatted_address;
            return {formatted_address:originalString};
        });
        // Convert Phone Number
        //model.phone = model.phone.filter(p => p.tel);
        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {user} = this.props;

        if (!user) {
            return {};
        }

        let v = {};
        //Convert name for redux-form
        v.name = user.name;
        //Convert surname for redux-form
        v.surname = user.surname;
        //Convert gender for redux-form
        v.gender = user.gender ? user.gender : "";
        //Convert language preferred for redux-form
        v.lang = user.lang ? user.lang : "";
        //Convert birthday for redux-form
        v.birthday = user.birthdayFormatted;
        // Addresses_private: Add one item if value empty
        v.addresses_private = (Array.isArray(user.addresses_private) && user.addresses_private.length > 0) ? 
        user.addresses_private : [{formatted_address: ""}];
        // Phone: Add one item if value empty
        v.phone =  (Array.isArray(user.phone) && user.phone.length > 0) ? 
        user.phone : [{tel: ""}];
        return v;
    }

    onSubmit(values) {
        const {showModal, editUser, user} = this.props;
        const model = this.createUserModel(values);
        console.log(model);

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
                    <Navbar/>
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">
                        <FormattedMessage
                            id="myAccountPrivateData"
                            defaultMessage="My Account Private data"
                        />
                    </h1>

                    <br/>
                    <Form
                        initialValues={this.getInitialValues(this)}
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
    user: getUser(state),
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
