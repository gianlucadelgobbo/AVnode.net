import {h, Component} from 'preact';
import {FormattedMessage} from 'preact-intl';
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import Form from './form'
import {connect} from 'preact-redux';
import {fetchModel, saveModel} from "./actions";
import {showModal} from "../../modal/actions";
import Loading from '../../loading'
import ErrorMessage from '../../errorMessage'
import ItemNotFound from '../../itemNotFound';
import {getDefaultModel} from "../selectors";
import {fetchList as fetchCountries} from '../../countries/actions'
import {getList as getCountries} from '../../countries/selectors'
import {MODAL_SAVED} from "../../modal/constants";
import {getErrorMessage, getIsFetching} from "../../events/selectors";
/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfilePrivate extends Component {


    componentDidMount() {
        const {fetchModel, fetchCountries} = this.props;
        fetchModel();
        fetchCountries();
    }


    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        //convert Gender
        model.gender = values.gender.value;
        //convert Lang
        model.lang = values.lang.value;
        // Convert Addresses_private
        model.addresses_private = model.addresses_private.map(a => {
            const originalString = a.formatted_address;
            return {formatted_address: originalString};
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
        v.phone = (Array.isArray(user.phone) && user.phone.length > 0) ?
            user.phone : [{tel: ""}];
        return v;
    }

    onSubmit(values) {
        const {showModal, editUser, user} = this.props;
        const model = this.createModelToSave(values);
        console.log(model);

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

        const {model, countries, showModal, errorMessage, isFetching} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu/>
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">
                        <FormattedMessage
                            id="myAccountPrivateData"
                            defaultMessage="My Account Private data"
                        />
                    </h1>

                    <br/>

                    {isFetching && !model && <Loading/>}

                    {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                    {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                    {!errorMessage && !isFetching && model && <Form
                        initialValues={this.getInitialValues(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        user={model}
                        showModal={showModal}
                        countries={countries}
                    />}
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    model: getDefaultModel(state),
    countries: getCountries(state),
    isFetching: getIsFetching(state),
    errorMessage: getErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal,
    fetchCountries
}, dispatch);

ProfilePrivate = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePrivate);

export default ProfilePrivate;
