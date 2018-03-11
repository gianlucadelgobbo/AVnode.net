import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText, renderDatePicker, renderList, multiInputTel} from "../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';

class ProfilePrivateForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            countries
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>

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
                        {value: 'Others', label: 'Others'}
                    ]}
                />

                <Field
                    name="lang"
                    component={renderList}
                    placeholder="Preferred language"
                    options={[
                        {value: 'en', label: 'English'},
                        {value: 'it', label: 'Italiano'},
                        {value: 'es', label: 'Español'},
                        {value: 'fr', label: 'Français'},
                        {value: 'pl', label: 'Polski'},
                        {value: 'ru', label: 'Russian'},
                        {value: 'hu', label: 'Hungarian'},
                        {value: 'by', label: 'Belarusian'},
                        {value: 'gr',label: 'Greek'}
                    ]}
                />

                <Field
                    name="birthday"
                    component={renderDatePicker}
                    placeholder="Date"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary">
                    Save
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
