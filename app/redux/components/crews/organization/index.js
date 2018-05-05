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
import {getModel, getErrorMessage, getIsFetching} from "../selectors";
import {MODAL_SAVED} from "../../modal/constants";
import {fetchList as fetchCategories} from "../../categories/actions";
import {getList as getCategories} from "../../categories/selectors";
import {locales, locales_labels} from "../../../../../config/default";
/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class CrewOrganization extends Component {


    componentDidMount() {
        const {fetchModel, fetchCategories, _id} = this.props;
        fetchModel({id: _id});
        fetchCategories();
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

        const {model, categories, showModal, errorMessage, isFetching, _id} = this.props;

        console.log(categories)

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">
                        <FormattedMessage
                            id="myAccountOrganizationData"
                            defaultMessage="My Account Organization data"
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
                        categories={categories}
                        tabs={locales}
                        labels={locales_labels}
                    />}
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, {_id}) => ({
    model: getModel(state, _id),
    categories: getCategories(state).map(c => ({label:c.name, value:c._id})),
    isFetching: getIsFetching(state,_id),
    errorMessage: getErrorMessage(state,_id),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal,
    fetchCategories
}, dispatch);

CrewOrganization = connect(
    mapStateToProps,
    mapDispatchToProps
)(CrewOrganization);

export default CrewOrganization;
