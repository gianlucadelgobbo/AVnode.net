import {h, render, Component} from 'preact';
import {reduxForm, Field} from "redux-form";

// import renderField from "../../renderField";
// import Abouts from "../../about/Abouts";
// import AddressesPublic from "../../place/AddressesPublic";
// import renderLabel from "../../renderLabel";
// import LinksSocial from "../../link/LinksSocial";
// import LinksWeb from "../../link/Links";
// import asyncValidate from "../../asyncValidate";
// import validate from "../../validators/ProfilePublicValidate";

import {FORM_NAME} from './constants'
import {inputText} from "../../common/form/components";

class ProfilePublicForm extends Component {

    render() {

        const {
            pristine,
            submitting,
            handleSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>

                <Field
                    name="name"
                    component={inputText}
                    placeholder="Name"
                />

                <button
                    type="submit"
                    disabled={pristine || submitting}
                    className="btn btn-rounded blue btn-icon-right">
                    Save
                </button>

            </form>
        );
    }

}

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    //validate,
    //asyncValidate,
    asyncBlurFields: ['slug']
})(ProfilePublicForm);
