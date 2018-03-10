import {h, render, Component} from 'preact';
import Navbar from '../navbar'
import Form from './form'
import {connect} from 'preact-redux';
import {getUser} from './selectors'
import {locales, locales_labels} from '../../../../../config/default.json'
import {editUser} from "../../../reducers/actions";
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfilePublic extends Component {

    // Convert form values to API model
    createUserModel(values) {

        //clone obj
        let model = Object.assign({}, values);

        //Convert abouts for API
        if (Array.isArray(model.abouts)) {
            model.abouts = model.abouts.map(x => {
                const splitted = x.key.split(".");
                return {
                    lang: splitted[splitted.length - 1],
                    abouttext: x.value
                }
            });
        }

        // Convert web
        model.web = model.web.filter(w => w.url);

        // Convert social
        model.social = model.social.filter(w => w.url);

        // Convert addresses
        model.addresses = model.addresses.map(a => a.text);

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {user} = this.props;

        if (!user) {
            return {};
        }

        let v = {};

        //Convert stagename for redux-form
        v.stagename = user.stagename;

        //Convert slug for redux-form
        v.slug = user.slug;

        // Convert about format for FieldArray redux-form
        if (Array.isArray(user.abouts)) {
            v.abouts = user.abouts.map(x => ({
                key: `abouts.${x.lang}`,
                value: x.abouttext
            }));
        }

        // Social: Add one item if value empty
        v.social = (Array.isArray(user.social) && user.social.length > 0) ? user.social : [{url: ""}];

        // Web: Add one item if value empty
        v.web = (Array.isArray(user.web) && user.web.length > 0) ? user.web : [{url: ""}];

        // Web: Add one item if value empty
        v.addresses = (Array.isArray(user.addresses) && user.addresses.length > 0) ?
            user.addresses.map(a => ({
                text: a
            })) :
            [{text: ""}];


        return v;
    }

    onSubmit(values) {
        const {showModal, editUser} = this.props;
        const model = this.createUserModel(values);

        // geocodeByAddress(this.state.address)
        //     .then(results => getLatLng(results[0]))
        //     .then(latLng => console.log('Success', latLng))
        //     .catch(error => console.error('Error', error))
        // console.log("model to save", model)

        //dispatch the action to save the model here
        editUser(model)
            .then(() => {
                showModal({
                    type: "EXAMPLE"
                });
            });
    }

    render() {

        const {user} = this.props;

        return (
            <div class="row">
                <div className="class-md-3">
                    <Navbar/>
                </div>
                <div className="class-md-9">
                    <h1>MY ACCOUNT PUBLIC DATA</h1>
                    <Form
                        initialValues={this.getInitialValues(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        aboutsTabs={locales}
                        aboutsLabels={locales_labels}
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

ProfilePublic = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePublic);

export default ProfilePublic;
