import {h, render, Component} from 'preact';
import {reduxForm, Field} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText, renderDatePicker, renderList} from "../../common/form/components";
import {locales, locales_labels} from '../../../../../config/default.json'
import validate from './validate';
import asyncValidate from './asyncValidate';

class ProfilePrivateForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            countries,
            onSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="name"
                    component={inputText}
                    placeholder="Name"
                />

                <Field
                    name="surname"
                    component={inputText}
                    placeholder="Surname"
                />

                <Field
                    name="gender"
                    component={renderList}
                    placeholder="Gender"
                    options={[
                        {value: 'M', label: 'Male'},
                        {value: 'F', label: 'Female'},
                        {value: 'Others', label: 'Other'}
                    ]}
                />

                <Field
                    name="lang"
                    component={renderList}
                    placeholder="Preferred language"
                    options={locales.map(l => ({
                        value: l,
                        label: locales_labels[l]
                    }))}
                />

                <Field
                    name="birthday"
                    component={renderDatePicker}
                    placeholder="Date"
                />

                <hr/>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-lg btn-block">
                    {submitting ? "Saving..." : "Save"}
                </button>

                {/*countries.map((c) => (
                    <h1 value={c.key.toLowerCase()}>{c.name}</h1>
                  ))
                */}

            </form>
        );
    }

}

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(ProfilePrivateForm);