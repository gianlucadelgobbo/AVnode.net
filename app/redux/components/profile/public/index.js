import {h, render, Component} from 'preact';
import Navbar from '../navbar'
import Form from './form'
import {connect} from 'preact-redux';
import {getUser} from './selectors'
import {locales, locales_labels} from '../../../../../config/default.json'

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfilePublic extends Component {

    // Convert form values to API model
    createUserModel(values) {
        //values.myCustomValue2 = "test";

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

        console.log("init", v);

        return v;
    }

    onSubmit(values) {
        //dispatch the action to save the model here
        console.log("values", this.createUserModel(values))
    }

    render() {

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

ProfilePublic = connect(
    mapStateToProps
)(ProfilePublic);

export default ProfilePublic;
